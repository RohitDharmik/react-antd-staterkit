import React, { useEffect } from 'react';
import gsapAnimations from '../../utils/gsapAnimations';

export default function Docs() {
  useEffect(() => {
    gsapAnimations.initScrollAnimations();
  }, []);

  const sections = [
    {
      h: 'Overview',
      d: 'This documentation provides a high-level guide to the public interface, theming, and animation primitives. It intentionally avoids any private app logic.',
    },
    {
      h: 'Getting Started',
      d: 'Install dependencies, run the dev server, and explore the routes: /, /about, /features, /docs, /contact, /login.',
    },
    {
      h: 'OGL Background',
      d: 'The OGL shader scene is mounted on #ogl-canvas and exposes start/stop/dispose APIs via a small wrapper.',
    },
    {
      h: 'GSAP Animations',
      d: 'Reusable animations are available in gsapAnimations: fadeInUp, scaleIn, float, and initScrollAnimations.',
    },
    {
      h: 'Styling',
      d: 'TailwindCSS with glassmorphism surfaces (backdrop blur, translucent panels) produces a futuristic UI.',
    },
    {
      h: 'Accessibility',
      d: 'Focus styles, color contrast, and reduced-motion considerations are recommended for production.',
    },
  ];

  return (
    <div>
      <div className="max-w-6xl mx-auto px-6">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-cyan-200" data-animate="fade-up">Documentation</h1>
          <p className="mt-3 text-slate-300/90" data-animate="fade-up">
            Start here to understand structure, animations, and theming for the public UI.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {sections.map((s, i) => (
            <article key={i} data-animate="fade-up" className="rounded-2xl p-5 bg-white/5 border border-white/10 backdrop-blur-md">
              <h3 className="text-cyan-200 font-semibold">{s.h}</h3>
              <p className="mt-2 text-slate-300/80">{s.d}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}