import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from "framer-motion";
import { useRef, useState } from "react";
import { Fade, Magnetic, RevealText, Tilt } from "./ui";
import { cn } from "@/lib/utils";

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">{children}</p>
);

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1.5 }}
        className="mb-8 font-mono text-[11px] uppercase tracking-[0.35em] text-muted-foreground"
      >
        Pre-visualization · Reimagined
      </motion.p>
      <h1 className="font-display text-6xl leading-[0.95] tracking-tight sm:text-8xl lg:text-[8rem]">
        <RevealText text="See the film" delay={0.3} />
        <br />
        <span className="italic text-gradient-fade"><RevealText text="before you make it." delay={0.55} /></span>
      </h1>
      <Fade delay={1} className="mt-10 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        Previzard is an AI-powered pre-visualization platform designed to help filmmakers turn creative ideas into visual direction before production begins.
      </Fade>
      <Fade delay={1.2} className="mt-12 flex flex-wrap justify-center gap-4">
        <Magnetic href="#vision">Discover Previzard <span aria-hidden>→</span></Magnetic>
        <Magnetic href="#contact" variant="ghost">Get in Touch</Magnetic>
      </Fade>
      <a href="#vision" aria-label="Scroll down" className="absolute bottom-6 flex flex-col [@media(max-height:860px)]:hidden items-center gap-3 text-muted-foreground">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-border">
          <span className="absolute left-0 top-0 h-3 w-px bg-foreground" style={{ animation: "scroll-dot 2s ease-in-out infinite" }} />
        </span>
      </a>
    </section>
  );
}

export function Problem() {
  return (
    <section id="vision" className="relative mx-auto max-w-6xl px-6 py-40 sm:py-56">
      <Label>01 — The problem</Label>
      <h2 className="font-display text-5xl leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl">
        <RevealText text="Production is expensive." />
        <br />
        <span className="italic text-muted-foreground"><RevealText text="Imagination shouldn't be difficult to communicate." delay={0.2} /></span>
      </h2>
      <div className="mt-24 grid gap-12 border-t border-border pt-12 md:grid-cols-12">
        <Fade className="text-lg leading-relaxed text-muted-foreground md:col-span-4 md:col-start-2">
          Before cameras roll, creative teams need to align on how a scene should look, feel and move.
        </Fade>
        <Fade delay={0.15} className="text-lg leading-relaxed text-muted-foreground md:col-span-4">
          Traditional pre-visualization can require significant time, specialized resources and repeated iteration.
        </Fade>
      </div>
      <Fade delay={0.2} className="mt-20 max-w-3xl font-display text-3xl leading-snug sm:text-4xl md:ml-[8.33%]">
        Previzard is being built to make early visualization faster, more accessible and easier to explore.
      </Fade>
    </section>
  );
}

const steps = ["Idea", "Understand", "Visualize", "Refine", "Pre-visualize"];

export function Process() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(4, Math.floor(v * 5.5))));
  const bar = useTransform(scrollYProgress, (v) => `${Math.min(100, (v / 0.9) * 100)}%`);
  return (
    <section ref={ref} className="relative h-[420vh]">
      <div className="sticky top-0 flex h-svh flex-col justify-center px-6">
        <div className="mx-auto w-full max-w-6xl">
          <Label>02 — From idea to visual direction</Label>
          <div className="relative h-[34vh] sm:h-[40vh]">
            {steps.map((s, i) => (
              <motion.h3
                key={s}
                aria-hidden={i !== active}
                animate={{
                  opacity: i === active ? 1 : 0,
                  y: i === active ? 0 : i < active ? -60 : 60,
                  filter: i === active ? "blur(0px)" : "blur(14px)",
                  letterSpacing: i === active ? "-0.03em" : "0.08em",
                }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "absolute inset-0 flex items-center font-display text-[17vw] leading-none sm:text-[12vw]",
                  i === 4 && "italic",
                )}
              >
                {s}
              </motion.h3>
            ))}
          </div>
          <div className="mt-10 flex items-center gap-4">
            <span className="font-mono text-xs text-accent">0{active + 1}</span>
            <div className="relative h-px flex-1 bg-border">
              <motion.div className="absolute inset-y-0 left-0 bg-foreground" style={{ width: bar }} />
            </div>
            <span className="font-mono text-xs text-muted-foreground">05</span>
          </div>
          <div className="mt-6 hidden justify-between font-mono text-[11px] uppercase tracking-[0.2em] sm:flex">
            {steps.map((s, i) => (
              <span key={s} className={cn("transition-colors duration-700", i <= active ? "text-foreground" : "text-faint")}>{s}</span>
            ))}
          </div>
          <p className="mt-14 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Previzard bridges the gap between what exists in the imagination and what a production team can see, discuss and refine.
          </p>
        </div>
      </div>
    </section>
  );
}

const pillars = [
  ["Understand", "Interpret creative material and establish the intended direction of a scene.", "I"],
  ["Visualize", "Turn ideas into visual representations that make creative direction easier to understand.", "II"],
  ["Refine", "Explore and iterate before committing significant production resources.", "III"],
];

export function Platform() {
  return (
    <section id="platform" className="relative mx-auto max-w-6xl px-6 py-40">
      <Label>03 — Platform</Label>
      <h2 className="max-w-4xl font-display text-5xl leading-[1.02] tracking-tight sm:text-7xl">
        <RevealText text="Built for the space" /> <span className="italic"><RevealText text="before production." delay={0.2} /></span>
      </h2>
      <div className="mt-24 grid gap-6 md:grid-cols-3" style={{ perspective: 1200 }}>
        {pillars.map(([t, d, n], i) => (
          <Fade key={t} delay={i * 0.15} className={cn(i === 1 && "md:translate-y-16", i === 2 && "md:translate-y-32")}>
            <Tilt className="overflow-hidden rounded-sm border border-border bg-surface/40 backdrop-blur-sm">
              <div className="relative flex aspect-[3/4] flex-col justify-between p-8">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  <span>Frame {n}</span><span>2.39 : 1</span>
                </div>
                <span aria-hidden className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 font-display text-[12rem] italic leading-none text-foreground/5 transition-transform duration-700 group-hover:-translate-x-4">
                  {n}
                </span>
                <div style={{ transform: "translateZ(40px)" }}>
                  <h3 className="font-display text-5xl">{t}</h3>
                  <p className="mt-4 leading-relaxed text-muted-foreground">{d}</p>
                </div>
              </div>
            </Tilt>
          </Fade>
        ))}
      </div>
    </section>
  );
}

const reasons = [
  ["Visual clarity", "Give creative teams a shared visual language."],
  ["Faster exploration", "Explore creative directions before expensive production decisions are locked in."],
  ["Creative alignment", "Help directors and production teams communicate visual intent more clearly."],
  ["Earlier iteration", "Move experimentation toward the beginning of the production process."],
];

export function Why() {
  return (
    <section id="why" className="relative mx-auto max-w-6xl px-6 py-40 md:pt-64">
      <Label>04 — Why Previzard</Label>
      <h2 className="font-display text-5xl leading-[1.02] tracking-tight sm:text-7xl">
        <RevealText text="Make creative decisions" /> <span className="italic text-accent"><RevealText text="earlier." delay={0.25} /></span>
      </h2>
      <div className="mt-24">
        {reasons.map(([t, d], i) => (
          <Fade key={t} delay={i * 0.08}>
            <div className="group grid items-baseline gap-4 border-t border-border py-10 transition-colors duration-500 hover:border-accent md:grid-cols-12">
              <span className="font-mono text-xs text-faint md:col-span-1">0{i + 1}</span>
              <h3 className="font-display text-4xl transition-transform duration-700 group-hover:translate-x-4 sm:text-5xl md:col-span-6">{t}</h3>
              <p className="text-muted-foreground md:col-span-5">{d}</p>
            </div>
          </Fade>
        ))}
      </div>
    </section>
  );
}

function Line({ p, range, children, italic }: { p: MotionValue<number>; range: [number, number, number, number]; children: string; italic?: boolean }) {
  const [a, b, c, d] = range;
  const vis = (v: number) => (v <= a || v >= d ? 0 : v < b ? (v - a) / (b - a) : v > c ? (d - v) / (d - c) : 1);
  const opacity = useTransform(p, vis);
  const scale = useTransform(p, (v) => 0.9 + 0.18 * Math.min(1, Math.max(0, (v - a) / (d - a))));
  const blur = useTransform(p, (v) => `blur(${(1 - vis(v)) * 20}px)`);
  return (
    <motion.p
      style={{ opacity, scale, filter: blur }}
      className={cn("absolute inset-0 flex items-center justify-center px-6 text-center font-display text-[13vw] leading-[0.92] tracking-tight sm:text-[9vw]", italic && "italic")}
    >
      {children}
    </motion.p>
  );
}

export function Statement() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const light = useTransform(p, (v) => Math.min(1, Math.max(0, (v - 0.3) / 0.4)));
  return (
    <section ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div
          aria-hidden
          style={{ opacity: light, background: "radial-gradient(ellipse 60% 45% at 50% 50%, var(--glow-accent), transparent 70%)" }}
          className="absolute inset-0"
        />
        <Line p={p} range={[0, 0.08, 0.38, 0.5]}>Pre-visualization shouldn't replace imagination.</Line>
        <Line p={p} range={[0.5, 0.62, 0.95, 1]} italic>It should make imagination visible.</Line>
      </div>
    </section>
  );
}

export function Storytellers() {
  return (
    <section className="relative mx-auto grid max-w-6xl gap-16 px-6 py-40 md:grid-cols-12">
      <div className="md:col-span-7">
        <Label>05 — Built for storytellers</Label>
        <h2 className="font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl">
          <RevealText text="Technology behind the scenes." />
          <br />
          <span className="italic text-muted-foreground"><RevealText text="Creativity in front." delay={0.2} /></span>
        </h2>
      </div>
      <Fade delay={0.2} className="self-end text-lg leading-relaxed text-muted-foreground md:col-span-5">
        Previzard is designed around filmmakers and creative teams—not around the technology powering it. The goal is simple: reduce the distance between imagining a scene and seeing its direction take shape.
      </Fade>
    </section>
  );
}

export function Privacy() {
  return (
    <section className="relative py-48">
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-transparent" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <Fade><div className="mx-auto mb-12 h-16 w-px bg-gradient-to-b from-transparent to-accent" /></Fade>
        <h2 className="font-display text-5xl tracking-tight sm:text-6xl"><RevealText text="Your ideas deserve privacy." /></h2>
        <Fade delay={0.3} className="mt-10 text-lg leading-relaxed text-muted-foreground">
          Film concepts, scripts and visual ideas can represent years of creative work. Previzard is being designed with privacy and responsible handling of creative material as a fundamental part of the platform.
        </Fade>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section id="contact" className="relative flex min-h-[130svh] items-center justify-center px-6">
      <div className="relative flex aspect-[2.39/1] w-full max-w-5xl flex-col items-center justify-center text-center">
        {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "left-0 bottom-0 border-l border-b", "right-0 bottom-0 border-r border-b"].map((c) => (
          <span key={c} aria-hidden className={cn("absolute h-6 w-6 border-accent", c)} />
        ))}
        <span className="absolute left-4 top-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Scene 01 · Take 01</span>
        <span className="absolute bottom-3 right-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Imagination → Structure → Visualization</span>
        <h2 className="font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
          <RevealText text="Visualize before" /> <br />
          <span className="italic"><RevealText text="production begins." delay={0.2} /></span>
        </h2>
        <Fade delay={0.4} className="mt-6 max-w-md text-muted-foreground">A new way to explore cinematic ideas before stepping onto set.</Fade>
        <Fade delay={0.6} className="mt-10">
          <Magnetic href="mailto:hello@previzard.com">Get in Touch <span aria-hidden>→</span></Magnetic>
        </Fade>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-border px-6 py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-3xl">Previzard</p>
          <p className="mt-2 text-sm text-muted-foreground">AI-powered pre-visualization for modern filmmaking.</p>
        </div>
        <div className="flex gap-8 text-sm text-muted-foreground">
          {[["Vision", "#vision"], ["Platform", "#platform"], ["Contact", "#contact"], ["Privacy", "#top"]].map(([l, h]) => (
            <a key={l} href={h} className="transition-colors hover:text-foreground">{l}</a>
          ))}
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl font-mono text-[11px] text-faint">© 2026 Previzard. All rights reserved.</p>
    </footer>
  );
}
