import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { gsapAnimations } from '../../utils/gsapAnimations';
import ThemeSwitcher from './ThemeSwitcher';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/features', label: 'Features' },
  { to: '/docs', label: 'Docs' },
  { to: '/contact', label: 'Contact' },
  { to: '/login', label: 'Login' },
];

export default function Navbar() {
  const navRef = useRef(null);
  const menuBtnRef = useRef(null);
  const firstLinkRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const prefersReduced = typeof window !== 'undefined'
    ? window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true
    : false;

  // init animations and listeners
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    gsapAnimations.fadeInUp(el, { trigger: el, start: 'top 100%' });

    // hover glow for links
    el.querySelectorAll('a.nav-link').forEach((a) => {
      const glow = gsapAnimations.navGlow(a);
      a.addEventListener('mouseenter', glow.enter);
      a.addEventListener('mouseleave', glow.leave);
    });

    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  // focus trap when menu open
  useEffect(() => {
    if (!open) return;
    const menu = document.getElementById('mobile-menu');
    const focusables = menu?.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])');
    const list = focusables ? Array.from(focusables) : [];
    const first = list[0];
    const last = list[list.length - 1];

    // move focus to first link for accessibility
    if (first) {
      firstLinkRef.current = first;
      first.focus();
    }

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;
      if (list.length === 0) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [open]);

  // close on route hashchange (covers in-app navigation side-effects)
  useEffect(() => {
    const onHash = () => setOpen(false);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Mic opt-in: deferred permission request
  const handleToggleMic = async () => {
    if (!micEnabled) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // immediately stop tracks to avoid live capture; we'll re-request in OGL when needed
        stream.getTracks().forEach((t) => t.stop());
        setMicEnabled(true);
        // dispatch a custom event for OGL scene to react to
        window.dispatchEvent(new CustomEvent('ncc:mic-enabled', { detail: { enabled: true } }));
      } catch (e) {
        console.warn('Mic permission denied or unavailable', e);
        setMicEnabled(false);
        window.dispatchEvent(new CustomEvent('ncc:mic-enabled', { detail: { enabled: false } }));
      }
    } else {
      setMicEnabled(false);
      window.dispatchEvent(new CustomEvent('ncc:mic-enabled', { detail: { enabled: false } }));
    }
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:rounded-md focus:bg-cyan-600 focus:text-white"
      >
        Skip to content
      </a>
      <nav
        ref={navRef}
        role="navigation"
        aria-label="Primary"
        className="fixed top-0 left-0 right-0 z-40 supports-[backdrop-filter]:backdrop-blur-md bg-slate-900/50 border-b border-cyan-400/20"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 rounded">
            <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#00e5ff]" aria-hidden="true"></div>
            <span className="font-semibold tracking-wide text-cyan-200">Neural Command Center</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2 sm:gap-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link px-3 py-1.5 rounded-md text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-400/10'
                      : 'text-slate-200 hover:text-cyan-300 hover:bg-cyan-400/5'
                  }`
                }
                aria-label={item.label}
              >
                {item.label}
              </NavLink>
            ))}

            {/* Mic opt-in toggle */}
            <button
              onClick={handleToggleMic}
              className={`ml-2 px-3 py-1.5 rounded-md text-sm border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
                micEnabled
                  ? 'text-cyan-300 bg-cyan-400/10 border-cyan-400/40'
                  : 'text-slate-200 bg-white/5 hover:bg-white/10 border-white/10'
              }`}
              title="Toggle microphone reactivity"
              aria-pressed={micEnabled}
            >
              {micEnabled ? 'Mic: On' : 'Mic: Off'}
            </button>

            {/* Theme switcher */}
            <div className="ml-2">
              <ThemeSwitcher />
            </div>
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={handleToggleMic}
              className={`px-3 py-1.5 rounded-md text-sm border transition ${
                micEnabled
                  ? 'text-cyan-300 bg-cyan-400/10 border-cyan-400/40'
                  : 'text-slate-200 bg-white/5 hover:bg-white/10 border-white/10'
              }`}
              title="Toggle microphone reactivity"
              aria-pressed={micEnabled}
            >
              {micEnabled ? 'Mic: On' : 'Mic'}
            </button>
            <ThemeSwitcher />
            <button
              ref={menuBtnRef}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((s) => !s)}
              className="p-2 rounded-md bg-white/5 border border-white/10 text-slate-200"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div
            id="mobile-menu"
            className="md:hidden border-t border-white/10 bg-slate-900/70 supports-[backdrop-filter]:backdrop-blur"
            role="dialog"
            aria-modal="true"
          >
            <div className="px-4 py-3 flex flex-col gap-2">
              {navItems.map((item, idx) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `nav-link px-3 py-2 rounded-md text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
                      isActive
                        ? 'text-cyan-300 bg-cyan-400/10'
                        : 'text-slate-200 hover:text-cyan-300 hover:bg-cyan-400/5'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <button
                onClick={() => {
                  setOpen(false);
                  // return focus to toggle
                  menuBtnRef.current?.focus();
                }}
                className="mt-2 px-3 py-2 rounded-md text-sm border text-slate-200 bg-white/5 hover:bg-white/10 border-white/10"
              >
                Close menu
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}