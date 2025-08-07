import React, { useEffect } from 'react';
import gsapAnimations from '../../utils/gsapAnimations';

export default function Contact() {
  useEffect(() => {
    gsapAnimations.initScrollAnimations();
  }, []);

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
          <div className="md:col-span-2">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="rounded-2xl p-6 bg-white/5 border border-white/10 backdrop-blur-md"
              data-animate="fade-up"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm text-slate-300/80">Name</label>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    className="mt-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-cyan-400/40 transition"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm text-slate-300/80">Email</label>
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    className="mt-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-cyan-400/40 transition"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm text-slate-300/80">Subject</label>
                <input
                  type="text"
                  placeholder="How can we help?"
                  className="mt-1 w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-cyan-400/40 transition"
                />
              </div>

              <div className="mt-4">
                <label className="text-sm text-slate-300/80">Message</label>
                <textarea
                  rows="5"
                  placeholder="Write your message..."
                  className="mt-1 w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-cyan-400/40 transition"
                ></textarea>
              </div>

              <button
                type="submit"
                className="mt-6 inline-flex items-center px-6 py-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/30 backdrop-blur-md transition shadow-[0_0_20px_rgba(0,229,255,0.25)]"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-4">
            {[
              { h: 'Support', d: 'We aim to respond within 2 business days.' },
              { h: 'Partnerships', d: 'Explore integrations and research pilots.' },
              { h: 'Feedback', d: 'Help us improve the public interface and docs.' },
            ].map((b, i) => (
              <div key={i} data-animate="scale-in" className="rounded-xl p-5 bg-white/5 border border-white/10 backdrop-blur-md">
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