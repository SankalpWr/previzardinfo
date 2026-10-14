import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { CursorLight, Nav } from "@/components/previzard/ui";
import {
  Hero, Problem, Process, Platform, Why, Statement, Storytellers, Privacy, FinalCTA, Footer,
} from "@/components/previzard/sections";

const Scene3D = lazy(() => import("@/components/previzard/Scene3D"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Previzard — See the film before you make it" },
      { name: "description", content: "Previzard is an AI-powered pre-visualization platform helping filmmakers turn creative ideas into visual direction before production begins." },
      { property: "og:title", content: "Previzard — See the film before you make it" },
      { property: "og:description", content: "AI-powered pre-visualization for modern filmmaking." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className="grain relative">
      <div aria-hidden className="fixed inset-0 z-0">
        {mounted && (
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        )}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--background)_100%)]" />
      </div>
      <CursorLight />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Problem />
        <Process />
        <Platform />
        <Why />
        <Statement />
        <Storytellers />
        <Privacy />
        <FinalCTA />
      </main>
      <div className="relative z-10"><Footer /></div>
    </div>
  );
}
