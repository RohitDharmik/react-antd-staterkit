import React, { useEffect, useRef } from 'react';
import gsapAnimations from '../../utils/gsapAnimations';

const features = [
  {
    title: 'Neural Telemetry',
    desc: 'Unified view of sensor feeds, agent states, and KPIs with anomaly glow.',
  },
  {
    title: 'Autonomous Routines',
    desc: 'Declarative workflows with pre/post checks and human-in-the-loop gates.',
  },
  {
    title: 'Secure Access',
    desc: 'Role-aware, least-privilege access layered with policy audits.',
  },
  {
    title: 'Extensible Plugins',
    desc: 'Bring your own LLMs, embeddings, skills, and drivers.',
  },
  {
    title: 'Observability',
    desc: 'Trace through events with time-warp scrubbing and spotlight.',
  },
  {
    title: 'API First',
    desc: 'Stable public contracts with typed SDKs for rapid integration.',
  },
];

export default function Features() {
  const orbitRef = useRef(null);

  useEffect(() => {
    gsapAnimations.initScrollAnimations();

    // Orbit a few icons around the Features title for a tech aura
    if (orbitRef.current) {
      const container = orbitRef.current;
      const dots = container.querySelectorAll('.orbit-dot');
      if (dots.length) {
        gsapAnimations.orbitIcons(container, {
          radius: 42,
          duration: 5,
          selectors: ['.orbit-dot:nth-child(1)', '.orbit-dot:nth-child(2)', '.orbit-dot:nth-child(3)'],
        });
      }
    }

    // Hover tilt for cards
    document.querySelectorAll('.feature-card').forEach((card) => {
      const { onEnter, onLeave } = gsapAnimations.hoverTilt(card);
      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mouseleave', onLeave);
    });

    return () => {};
  }, []);

  return (
    <div>
      <section className="max-w-6xl mx-auto px-6">
        <header className="text-center relative inline-block" ref={orbitRef}>
          <h1 className="text-4xl font-bold text-cyan-200" data-animate="fade-up">Features</h1>
          {/* orbiting dots */}
          <div className="absolute -top-3 -right-6 flex gap-2 pointer-events-none">
            <span className="orbit-dot w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff]" />
            <span className="orbit-dot w-2 h-2 rounded-full bg-fuchsia-400 shadow-[0_0_8px_#ff4dff]" />
            <span className="orbit-dot w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_#7c4dff]" />
          </div>
        </header>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              data-animate="scale-in"
              className="feature-card will-change-transform glass-panel p-5 hover:border-cyan-400/30 transition [transform-style:preserve-3d]"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00e5ff]" />
              <h3 className="mt-4 text-lg font-semibold text-cyan-200">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-300/80">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
        <div data-animate="fade-up" className="glass-panel border-cyan-400/20 p-6">
          <h4 className="text-cyan-200 font-semibold">ScrollTrigger Timelines</h4>
          <p className="mt-2 text-slate-300/80">
            Sections cascade in to guide attention and create narrative flow without overwhelming the user.
          </p>
        </div>
        <div data-animate="fade-up" className="glass-panel p-6">
          <h4 className="text-slate-100 font-semibold">Glassmorphism Surface</h4>
          <p className="mt-2 text-slate-300/80">
            Frosted panels float above a living neural backdrop, balancing contrast with depth.
          </p>
        </div>
      </section>
    </div>
  );
}