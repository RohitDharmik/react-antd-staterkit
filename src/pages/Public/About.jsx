import React, { useEffect } from 'react';
import gsapAnimations from '../../utils/gsapAnimations';

export default function About() {
  useEffect(() => {
    gsapAnimations.initScrollAnimations();
  }, []);

  return (
    <div>
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-cyan-200" data-animate="fade-up">About Neural Command Center</h1>
        <p className="mt-4 text-slate-300/90 leading-relaxed" data-animate="fade-up">
          Neural Command Center is a public-facing interface concept for orchestrating intelligent systems with clarity, speed, and safety.
          It embraces a sci‑fi aesthetic while focusing on usability and performance.
        </p>

        <section className="mt-10 grid md:grid-cols-3 gap-6">
          {[
            { h: 'Mission', d: 'Unify human + AI collaboration into an intuitive command surface.' },
            { h: 'Tech Stack', d: 'React, TailwindCSS, OGL for WebGL, GSAP ScrollTrigger for motion.' },
            { h: 'Use Cases', d: 'Observability, automations, device & agent control, and analytics.' },
          ].map((b, i) => (
            <div key={i} data-animate="scale-in" className="rounded-xl p-5 bg-white/5 border border-white/10 backdrop-blur-md">
              <h3 className="text-cyan-200 font-semibold">{b.h}</h3>
              <p className="mt-2 text-slate-300/80">{b.d}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}