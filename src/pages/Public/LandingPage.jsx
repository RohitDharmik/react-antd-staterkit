import React, { useEffect, useRef, useState } from 'react';
import gsapAnimations from '../../utils/gsapAnimations';
import { OGLScene } from '../../utils/OGLScene';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const canvasRef = useRef(null);
  const oglInstance = useRef(null);
  const marqueeRef = useRef(null);
  const [audioOn, setAudioOn] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    gsapAnimations.initScrollAnimations();
  }, []);

  useEffect(() => {
    // OGL Background: direct init
    if (canvasRef.current) {
      try {
        oglInstance.current = new OGLScene(canvasRef.current, {
          colorA: '#00E5FF',
          colorB: '#8A2BE2',
        });
        oglInstance.current.start();
      } catch (e) {
        console.warn('Failed to init OGL scene', e);
      }
    }

    const onMicToggle = (e) => {
      if (oglInstance.current) {
        oglInstance.current.micEnabled = !!e.detail?.enabled;
      }
    };
    window.addEventListener('ncc:mic-enabled', onMicToggle);

    // Tech marquee auto-scroll (respect reduced motion)
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;
    if (marqueeRef.current) {
      const row = marqueeRef.current.querySelector('.marquee-row');
      if (row) {
        if (!prefersReduced) {
          const duration = 14;
          row.style.animation = `marquee ${duration}s linear infinite`;
        } else {
          row.style.animation = 'none';
        }
      }
    }

    return () => {
      window.removeEventListener('ncc:mic-enabled', onMicToggle);
      try {
        oglInstance.current?.dispose?.();
      } catch {}
      oglInstance.current = null;
    };
  }, []);

  const toggleAmbient = async () => {
    // Ambient audio scaffold: disabled by default, user opt-in
    try {
      if (!audioOn) {
        if (!audioRef.current) {
          const el = new Audio(
            'data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQAA'
          );
          el.loop = true;
          el.volume = 0.15;
          audioRef.current = el;
        }
        await audioRef.current.play().catch(() => {});
        setAudioOn(true);
      } else {
        audioRef.current?.pause();
        setAudioOn(false);
      }
    } catch (e) {
      console.warn('Ambient audio toggle failed', e);
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden bg-slate-950">
      {/* OGL background */}
      <div className="absolute inset-0 -z-10">
        <canvas ref={canvasRef} className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/10 to-slate-950/80 pointer-events-none" />
      </div>

      {/* Ambient audio badge (scaffold) */}
      <button
        onClick={toggleAmbient}
        className="ambient-audio-badge"
        aria-pressed={audioOn}
        title="Toggle ambient audio"
        style={{ display: 'none' }}
      >
        {audioOn ? 'Ambient: On' : 'Ambient: Off'}
      </button>

      {/* Hero */}
      <header className="hero pt-28 sm:pt-32 pb-16 sm:pb-24 relative">
        {/* Subtle light accents behind the headline */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-3xl opacity-30"
               style={{ background: 'radial-gradient(closest-side, color-mix(in oklab, var(--accent,#3b82f6) 28%, transparent), transparent 70%)' }} />
          <div className="absolute top-0 right-0 w-[380px] h-[380px] rounded-full blur-2xl opacity-25"
               style={{ background: 'radial-gradient(closest-side, color-mix(in oklab, var(--accent,#3b82f6) 22%, transparent), transparent 70%)' }} />
          <div className="absolute bottom-[-80px] left-8 w-[300px] h-[300px] rounded-full blur-2xl opacity-20"
               style={{ background: 'radial-gradient(closest-side, rgba(139,92,246,0.35), transparent 70%)' }} />
        </div>
        <div className="container-page">
          <div className="max-w-3xl relative">
            {/* Accent edge line */}
            <div className="absolute -left-6 top-1 h-10 w-[2px] rounded-full bg-cyan-400/60 shadow-[0_0_18px_rgba(34,211,238,0.6)]" aria-hidden="true" />
            <h1 className="hero-title h1">
              Welcome to the Future of Control
            </h1>
            <p className="hero-sub p mt-4">
              Your AI-powered interface to sync, automate, and command your world.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                to="/features"
                className="hero-cta btn-glow"
              >
                Launch Command Center
              </Link>
              <Link
                to="/docs"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 backdrop-blur-md transition"
              >
                See It in Action
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative top gradient to add more light */}
        <div className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-64 opacity-40"
             style={{ background: 'linear-gradient(180deg, color-mix(in oklab, var(--accent,#3b82f6) 18%, transparent) 0%, transparent 80%)' }} />
      </header>

      {/* Feature highlights (3 cards) */}
      <section className="relative py-14 sm:py-20">
        <div className="container-page grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Universal Device Sync', desc: 'Seamlessly connect phone, PC, and smart home.' },
            { title: 'Voice / Face Recognition', desc: 'Authentication with natural inputs and profile context.' },
            { title: 'AI Automation', desc: 'Declarative routines orchestrated with guardrails.' },
          ].map((c, i) => (
            <div
              key={i}
              data-animate="scale-in"
              className="hover-lift glass-panel p-6 relative overflow-hidden"
            >
              <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-cyan-400/10 blur-2xl" />
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00e5ff]" />
              <h3 className="mt-4 text-lg font-semibold text-cyan-200">{c.title}</h3>
              <p className="mt-2 text-sm text-slate-300/80">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live demo simulation timeline */}
      <section className="relative py-16">
        <div className="container-narrow">
          <h2 className="h2 text-cyan-200 mb-8" data-animate="fade-up">
            Say: “Start Work Mode”
          </h2>
          <div className="relative grid md:grid-cols-3 gap-6">
            {[
              { h: 'Set Scene', d: 'Lights to 35%, focus playlist, DND enabled.' },
              { h: 'Prep Systems', d: 'Boot workstation, open brief, sync calendar.' },
              { h: 'Notify', d: 'Status posted to team and home dashboard.' },
            ].map((s, i) => (
              <div key={i} data-animate="fade-up" className="glass-panel p-5">
                <div className="text-cyan-300 text-sm">Step {i + 1}</div>
                <h4 className="text-slate-100 font-semibold">{s.h}</h4>
                <p className="text-slate-300/80 mt-1 text-sm">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use case gallery */}
      <section className="relative py-16">
        <div className="container-page">
          <h2 className="h2 text-cyan-200 mb-8" data-animate="fade-up">
            Use Cases
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Home', 'Work', 'Travel', 'Multi‑user'].map((k, i) => (
              <div key={k} data-animate="scale-in" className="glass-panel p-4 hover-lift">
                <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00e5ff]" />
                <div className="mt-2 text-slate-100 font-semibold">{k}</div>
                <p className="text-slate-300/80 text-sm mt-1">
                  Scenario‑optimized scenes and guardrailed actions.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack marquee carousel */}
      <section className="relative py-12">
        <div className="container-page">
          <div ref={marqueeRef} className="overflow-hidden" data-animate="fade-up">
            <div className="marquee-row whitespace-nowrap flex gap-6">
              {['GPT-4o', 'Whisper', 'OGL', 'GSAP', 'Home Assistant', 'MQTT', 'Zigbee2MQTT', 'Docker', 'Vite'].map((t, i) => (
                <div
                  key={`${t}-${i}`}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 inline-flex items-center"
                >
                  {t}
                </div>
              ))}
              {['GPT-4o', 'Whisper', 'OGL', 'GSAP', 'Home Assistant', 'MQTT', 'Zigbee2MQTT', 'Docker', 'Vite'].map((t, i) => (
                <div
                  key={`dup-${t}-${i}`}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 inline-flex items-center"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-16">
        <div className="container-narrow">
          <div className="glass-accent p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-cyan-200">Ready to Experience the Command Center?</h3>
              <p className="text-slate-300/80 mt-1">Launch the AI‑powered interface and see it live.</p>
            </div>
            <div className="flex gap-3">
              <Link to="/login" className="btn-glow">Start Now</Link>
              <Link
                to="/features"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 backdrop-blur-md transition"
              >
                See It in Action
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
    </div>
  );
}