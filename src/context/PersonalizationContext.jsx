import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

const STORAGE_KEY = 'personalization:v1';

// Supported themes: dark (glass-dark), cyber (neon), glass (glass-contrast)
export const THEME_PRESETS = ['glass-dark', 'neon', 'glass-contrast'];

const defaultState = {
  theme: 'glass-dark',
  accent: '#3b82f6',
};

export const PersonalizationContext = createContext({
  theme: defaultState.theme,
  accent: defaultState.accent,
  setTheme: () => {},
  setAccent: () => {},
  cycleTheme: () => {},
  reset: () => {},
});

export const PersonalizationProvider = ({ children }) => {
  const [theme, setThemeState] = useState(defaultState.theme);
  const [accent, setAccentState] = useState(defaultState.accent);
  const prevThemeRef = useRef(defaultState.theme);

  // load persisted preferences (if any)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.theme && THEME_PRESETS.includes(parsed.theme)) setThemeState(parsed.theme);
        if (parsed.accent) setAccentState(parsed.accent);
      }
    } catch {
      // ignore parsing/storage errors
    }
  }, []);

  // persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, accent }));
    } catch {
      // ignore write errors
    }
  }, [theme, accent]);

  // animated theme transition with GSAP (respect reduced motion)
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;

    // create a quick overlay flash for cinematic transition
    const overlayId = 'theme-transition-overlay';
    let overlay = document.getElementById(overlayId);
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = overlayId;
      Object.assign(overlay.style, {
        position: 'fixed',
        inset: '0',
        pointerEvents: 'none',
        background:
          'radial-gradient(60% 60% at 50% 50%, rgba(0,229,255,0.15), rgba(0,0,0,0.0) 60%)',
        opacity: '0',
        zIndex: '999',
      });
      document.body.appendChild(overlay);
    }

    const durationIn = prefersReduced ? 0 : 0.25;
    const durationOut = prefersReduced ? 0 : 0.35;

    const tl = gsap.timeline({ defaults: { duration: durationIn, ease: 'power2.out' } });
    tl.to(overlay, { opacity: prefersReduced ? 0 : 1 }, 0)
      .to(body, { filter: prefersReduced ? 'none' : 'saturate(1.2) brightness(1.05) blur(1px)' }, 0)
      .add(() => {
        // apply theme variables midway
        root.dataset.appTheme = theme;
        root.style.setProperty('--accent', accent);

        if (theme === 'glass-dark') {
          root.style.setProperty('--bg-dark-start', '#0f172a');
          root.style.setProperty('--bg-dark-mid', '#1e293b');
          root.style.setProperty('--bg-dark-end', '#0f172a');
        } else if (theme === 'glass-contrast') {
          root.style.setProperty('--bg-dark-start', '#0b1220');
          root.style.setProperty('--bg-dark-mid', '#0f172a');
          root.style.setProperty('--bg-dark-end', '#0b1220');
        } else if (theme === 'neon') {
          root.style.setProperty('--bg-dark-start', '#0a0f1f');
          root.style.setProperty('--bg-dark-mid', '#101a35');
          root.style.setProperty('--bg-dark-end', '#0a0f1f');
        }
      })
      .to(body, { filter: 'none', duration: durationOut, ease: 'power3.out' }, '+=0.05')
      .to(overlay, { opacity: 0, duration: durationOut }, '<');

    prevThemeRef.current = theme;

    return () => {
      // keep overlay node for re-use
    };
  }, [theme, accent]);

  const setTheme = (t) => {
    if (!THEME_PRESETS.includes(t)) return;
    setThemeState(t);
  };
  const cycleTheme = () => {
    const idx = THEME_PRESETS.indexOf(theme);
    const next = THEME_PRESETS[(idx + 1) % THEME_PRESETS.length];
    setThemeState(next);
  };
  const setAccent = (a) => setAccentState(a);
  const reset = () => {
    setThemeState(defaultState.theme);
    setAccentState(defaultState.accent);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const value = useMemo(
    () => ({ theme, accent, setTheme, setAccent, cycleTheme, reset }),
    [theme, accent]
  );

  return <PersonalizationContext.Provider value={value}>{children}</PersonalizationContext.Provider>;
};

export const usePersonalization = () => useContext(PersonalizationContext);