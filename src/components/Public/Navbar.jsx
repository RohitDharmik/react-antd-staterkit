import React, { useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { gsapAnimations } from '../../utils/gsapAnimations';

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

    return () => {
      el.querySelectorAll('a.nav-link').forEach((a) => {
        // listeners auto GC on removal
      });
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-slate-900/40 border-b border-cyan-400/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#00e5ff]"></div>
          <span className="font-semibold tracking-wide text-cyan-200">Neural Command Center</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link px-3 py-1.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-400/10'
                    : 'text-slate-200 hover:text-cyan-300 hover:bg-cyan-400/5'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}