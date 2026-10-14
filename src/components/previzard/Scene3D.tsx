import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function rectPoint(w: number, h: number): [number, number] {
  const per = 2 * (w + h);
  let d = Math.random() * per;
  if (d < w) return [d - w / 2, h / 2];
  d -= w;
  if (d < h) return [w / 2, h / 2 - d];
  d -= h;
  if (d < w) return [w / 2 - d, -h / 2];
  d -= w;
  return [-w / 2, -h / 2 + d];
}

function buildAttributes(count: number) {
  const a = new Float32Array(count * 3);
  const b = new Float32Array(count * 3);
  const c = new Float32Array(count * 3);
  const rnd = new Float32Array(count);
  const fill = new Float32Array(count);
  const fw = 2.3, fh = 1.3, gx = 2.65, gy = 1.6;
  for (let i = 0; i < count; i++) {
    // A: drifting idea cloud
    const r = 2 + Math.pow(Math.random(), 0.6) * 6;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    a.set([r * Math.sin(ph) * Math.cos(th) * 1.4, r * Math.cos(ph) * 0.8, r * Math.sin(ph) * Math.sin(th) - 2], i * 3);

    const isFill = Math.random() < 0.35 ? 1 : 0;
    fill[i] = isFill;
    rnd[i] = Math.random();

    // B: storyboard of 6 frames
    const f = i % 6;
    const col = (f % 3) - 1, row = f < 3 ? 0.5 : -0.5;
    const [px, py]: [number, number] = isFill ? [(Math.random() - 0.5) * fw, (Math.random() - 0.5) * fh] : rectPoint(fw, fh);
    b.set([col * gx + px, row * gy + py, -Math.abs(col) * 0.8 + (isFill ? -0.02 : 0)], i * 3);

    // C: single cinematic frame (2.39:1) with thirds guides
    const W = 7.6, H = 3.18;
    let cx: number, cy: number;
    if (isFill) {
      const g = Math.random();
      if (g < 0.5) { cx = (Math.random() < 0.5 ? -1 : 1) * W / 6; cy = (Math.random() - 0.5) * H; }
      else { cx = (Math.random() - 0.5) * W; cy = (Math.random() < 0.5 ? -1 : 1) * H / 6; }
    } else [cx, cy] = rectPoint(W, H);
    c.set([cx, cy, 0], i * 3);
  }
  return { a, b, c, rnd, fill };
}

const vert = /* glsl */ `
uniform float uTime, uM1, uM2, uSize, uPR;
attribute vec3 aB; attribute vec3 aC; attribute float aRnd; attribute float aFill;
varying float vAlpha; varying float vWarm;
void main(){
  float m1 = clamp(uM1 * 1.5 - aRnd * 0.5, 0.0, 1.0);
  float m2 = clamp(uM2 * 1.5 - aRnd * 0.5, 0.0, 1.0);
  m1 = m1*m1*(3.0-2.0*m1); m2 = m2*m2*(3.0-2.0*m2);
  vec3 p = mix(mix(position, aB, m1), aC, m2);
  float chaos = 1.0 - m1 * (1.0 - 0.0) ;
  chaos = max(chaos, 0.0) + 0.04;
  p += vec3(sin(uTime*0.4 + aRnd*40.0), cos(uTime*0.3 + aRnd*25.0), sin(uTime*0.35 + aRnd*12.0)) * 0.35 * chaos;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float s = mix(1.0, aFill > 0.5 ? 0.5 : 0.9, max(m1, m2));
  gl_PointSize = uSize * s * (0.6 + aRnd*0.8) * uPR / -mv.z;
  vAlpha = mix(0.55, aFill > 0.5 ? 0.18 : 0.7, max(m1, m2));
  vWarm = step(0.93, aRnd);
}`;
const frag = /* glsl */ `
uniform float uDim;
varying float vAlpha; varying float vWarm;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  vec3 col = mix(vec3(0.93,0.93,0.95), vec3(1.0,0.78,0.5), vWarm);
  gl_FragColor = vec4(col, a * vAlpha * uDim);
}`;

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

function Particles({ count, reduced }: { count: number; reduced: boolean }) {
  const geo = useMemo(() => {
    const { a, b, c, rnd, fill } = buildAttributes(count);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(a, 3));
    g.setAttribute("aB", new THREE.BufferAttribute(b, 3));
    g.setAttribute("aC", new THREE.BufferAttribute(c, 3));
    g.setAttribute("aRnd", new THREE.BufferAttribute(rnd, 1));
    g.setAttribute("aFill", new THREE.BufferAttribute(fill, 1));
    return g;
  }, [count]);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 }, uM1: { value: 0 }, uM2: { value: 0 },
          uSize: { value: 38 }, uPR: { value: 1 }, uDim: { value: 1 },
        },
      }),
    [],
  );
  const group = useRef<THREE.Points>(null);
  const { camera, gl } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const prog = useRef(0);

  useFrame((state, raw) => {
    const dt = Math.min(raw, 0.05);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const target = max > 0 ? window.scrollY / max : 0;
    prog.current += (target - prog.current) * (1 - Math.exp(-4 * dt));
    const t = prog.current;
    const u = mat.uniforms as Record<"uTime" | "uM1" | "uM2" | "uSize" | "uPR" | "uDim", { value: number }>;
    if (!reduced) u.uTime.value += dt;
    u.uPR.value = gl.getPixelRatio();
    u.uM1.value = smooth(0.06, 0.32, t);
    u.uM2.value = smooth(0.8, 0.9, t);
    // dim through the typography-heavy middle and privacy
    u.uDim.value = 1 - 0.55 * smooth(0.36, 0.45, t) * (1 - smooth(0.82, 0.9, t));
    if (group.current) {
      const spin = (1 - u.uM1.value) * state.clock.elapsedTime * 0.04;
      group.current.rotation.y = reduced ? 0 : spin + Math.sin(t * Math.PI * 2) * 0.25 * (1 - u.uM2.value);
      group.current.rotation.x = Math.sin(t * Math.PI) * 0.12 * (1 - u.uM2.value);
    }
    mouse.current.x += (state.pointer.x - mouse.current.x) * (1 - Math.exp(-2 * dt));
    mouse.current.y += (state.pointer.y - mouse.current.y) * (1 - Math.exp(-2 * dt));
    const k = reduced ? 0 : 0.8;
    camera.position.set(mouse.current.x * k, mouse.current.y * k * 0.6, 9 - t * 1.2);
    camera.lookAt(0, 0, 0);
  });

  return <points ref={group} geometry={geo} material={mat} />;
}

export default function Scene3D() {
  const mobile = typeof window !== "undefined" && window.innerWidth < 768;
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <Canvas
      dpr={[1, mobile ? 1.25 : 1.6]}
      camera={{ position: [0, 0, 9], fov: mobile ? 70 : 50 }}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
    >
      <Particles count={mobile ? 2200 : 5200} reduced={reduced} />
    </Canvas>
  );
}
