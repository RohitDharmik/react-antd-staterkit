import React, { useEffect, useRef, useState } from 'react';
import gsapAnimations from '../../utils/gsapAnimations';

export default function Contact() {
  const formRef = useRef(null);
  const particleRef = useRef(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    gsapAnimations.initScrollAnimations();

    // Input focus glow via event delegation
    const form = formRef.current;
    const onFocus = (e) => {
      const t = e.target;
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') {
        t.classList.add('neon-focus');
      }
    };
    const onBlur = (e) => {
      const t = e.target;
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') {
        t.classList.remove('neon-focus');
      }
    };
    form?.addEventListener('focusin', onFocus);
    form?.addEventListener('focusout', onBlur);

    // Lightweight cursor particles (CSS-only transform with requestAnimationFrame)
    const container = particleRef.current;
    let raf;
    const dots = Array.from(container?.querySelectorAll('.p-dot') || []);
    const move = (e) => {
      const { clientX: x, clientY: y } = e;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        dots.forEach((d, i) => {
          d.style.transform = `translate(${x}px, ${y}px) scale(${1 - i * 0.08})`;
          d.style.opacity = `${0.9 - i * 0.15}`;
        });
      });
    };
    window.addEventListener('mousemove', move, { passive: true });

    return () => {
      form?.removeEventListener('focusin', onFocus);
      form?.removeEventListener('focusout', onBlur);
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    // fake submit then show thank-you
    setSent(true);
  };

  return (
    <div>
      <div className="max-w-5xl mx-auto px-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-cyan-200" data-animate="fade-up">Contact</h1>
          <p className="mt-3 text-slate-300/90" data-animate="fade-up">
            Have a question or want to collaborate? Send a message below.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 relative">
            {/* Particle layer */}
            <div ref={particleRef} className="pointer-events-none absolute inset-0 -z-0">
              {/* small particle trail */}
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className="p-dot absolute top-0 left-0 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_12px_#00e5ff]"
                  style={{ transform: 'translate(-100px,-100px)' }}
                />
              ))}
            </div>

            {!sent ? (
              <form
                ref={formRef}
                onSubmit={onSubmit}
                className="glass-panel p-6"
                data-animate="fade-up"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm text-slate-300/80">Name</label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      className="mt-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 outline-none transition"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-slate-300/80">Email</label>
                    <input
                      type="email"
                      placeholder="jane@example.com"
                      className="mt-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 outline-none transition"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-sm text-slate-300/80">Subject</label>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    className="mt-1 w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 outline-none transition"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-sm text-slate-300/80">Message</label>
                  <textarea
                    rows="5"
                    placeholder="Write your message..."
                    className="mt-1 w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 outline-none transition"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="mt-6 btn-glow"
                >
                  Send Message
                </button>
              </form>
            ) : (
              <div
                data-animate="scale-in"
                className="glass-accent p-8 text-center"
                role="status"
                aria-live="polite"
              >
                <h3 className="text-xl font-semibold text-cyan-200">Thank you!</h3>
                <p className="mt-2 text-slate-300/80">
                  We received your message and will get back to you soon.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {[
              { h: 'Support', d: 'We aim to respond within 2 business days.' },
              { h: 'Partnerships', d: 'Explore integrations and research pilots.' },
              { h: 'Feedback', d: 'Help us improve the public interface and docs.' },
            ].map((b, i) => (
              <div key={i} data-animate="scale-in" className="glass-panel p-5">
                <h3 className="text-cyan-200 font-semibold">{b.h}</h3>
                <p className="mt-2 text-slate-300/80">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}