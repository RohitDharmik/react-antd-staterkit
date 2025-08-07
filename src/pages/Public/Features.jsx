import React, { useEffect } from 'react';
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
  useEffect(() => {
    gsapAnimations.initScrollAnimations();
  }, []);

  return (
    <div>
      <section className="max-w-6xl mx-auto px-6">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-cyan-200" data-animate="fade-up">Features</h1>
          <p className="mt-3 text-slate-300/90" data-animate="fade-up">
            Built for performance, clarity, and safe autonomy.
          </p>
        </header>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              data-animate="scale-in"
              className="rounded-2xl p-5 bg-white/5 border border-white/10 backdrop-blur-md hover:border-cyan-400/30 transition"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00e5ff]" />
              <h3 className="mt-4 text-lg font-semibold text-cyan-200">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-300/80">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
        <div data-animate="fade-up" className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6 backdrop-blur-md">
          <h4 className="text-cyan-200 font-semibold">ScrollTrigger Timelines</h4>
          <p className="mt-2 text-slate-300/80">
            Sections cascade in to guide attention and create narrative flow without overwhelming the user.
          </p>
        </div>
        <div data-animate="fade-up" className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <h4 className="text-slate-100 font-semibold">Glassmorphism Surface</h4>
          <p className="mt-2 text-slate-300/80">
            Frosted panels float above a living neural backdrop, balancing contrast with depth.
          </p>
        </div>
      </section>
    </div>
  );
}