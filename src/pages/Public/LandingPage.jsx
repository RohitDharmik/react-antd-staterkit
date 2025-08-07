import React, { useEffect, useRef } from 'react';
import Navbar from '../../components/Public/Navbar';
import gsapAnimations from '../../utils/gsapAnimations';
import { mountOGL } from '../../utils/OGLScene';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const oglRef = useRef(null);
  const oglInstance = useRef(null);

  useEffect(() => {
    gsapAnimations.initScrollAnimations();
  }, []);

  useEffect(() => {
    if (oglRef.current) {
      oglInstance.current = mountOGL('ogl-canvas', {
        colorA: '#00E5FF',
        colorB: '#8A2BE2',
      });
    }
    return () => {
      oglInstance.current?.dispose?.();
      oglInstance.current = null;
    };
  }, []);

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden bg-slate-950">
       

      <div ref={oglRef} className="absolute inset-0 -z-10">
        <canvas   className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/10 to-slate-950/80 pointer-events-none" />
      </div>

      <header className="hero pt-28 sm:pt-32 pb-16 sm:pb-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="hero-title text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
              Neural Command Center
            </h1>
            <p className="hero-sub mt-4 text-lg sm:text-xl text-cyan-100/80">
              Orchestrate intelligent systems with a unified, futuristic interface.
              Real-time insights, automation, and AI command — in one place.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <Link
                to="/features"
                className="hero-cta inline-flex items-center px-6 py-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/30 backdrop-blur-md transition shadow-[0_0_20px_rgba(0,229,255,0.3)]"
              >
                Explore Features
              </Link>
              <Link
                to="/docs"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 backdrop-blur-md transition"
              >
                Read Docs
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="relative py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Realtime Telemetry', desc: 'Visualize multi-source streams with neural overlays.' },
            { title: 'AI Automations', desc: 'Trigger autonomous routines with guardrails and feedback.' },
            { title: 'Secure Gateway', desc: 'Zero‑trust, role-aware access for operators and services.' },
            { title: 'Extensible APIs', desc: 'Integrate devices, LLMs, agents, and data pipelines.' },
            { title: 'Observability', desc: 'End-to-end tracing with anomaly detection highlights.' },
            { title: 'Human-in-the-loop', desc: 'Mixed-initiative UX for safe intervention and guidance.' },
          ].map((c, i) => (
            <div
              key={i}
              data-animate="scale-in"
              className="rounded-2xl p-5 bg-white/5 border border-white/10 backdrop-blur-md hover:border-cyan-400/30 transition shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00e5ff]" />
              <h3 className="mt-4 text-lg font-semibold text-cyan-200">{c.title}</h3>
              <p className="mt-2 text-sm text-slate-300/80">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* <section className="relative py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
          <div data-animate="fade-up" className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6 backdrop-blur-md">
            <h4 className="text-cyan-200 font-semibold">Neural Mesh Background</h4>
            <p className="mt-2 text-slate-300/80">
              The OGL shader creates a dynamic wave mesh that responds to pointer movement, adding
              a living, neural feel to the interface.
            </p>
          </div>
          <div data-animate="fade-up" className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h4 className="text-slate-100 font-semibold">GSAP Scroll Orchestration</h4>
            <p className="mt-2 text-slate-300/80">
              Sections reveal softly with parallax timing, while CTAs scale and glow, guiding the user
              through the narrative.
            </p>
          </div>
        </div>
      </section> */}

       
    </div>
  );
}