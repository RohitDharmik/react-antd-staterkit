import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'personalization:v1';

const defaultState = {
  theme: 'glass-dark', // 'glass-dark' | 'glass-contrast' | 'neon'
  accent: '#3b82f6',
};

export const PersonalizationContext = createContext({
  theme: defaultState.theme,
  accent: defaultState.accent,
  setTheme: () => {},
  setAccent: () => {},
  reset: () => {},
});

export const PersonalizationProvider = ({ children }) => {
  const [theme, setThemeState] = useState(defaultState.theme);
  const [accent, setAccentState] = useState(defaultState.accent);

  // load persisted preferences (if any)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.theme) setThemeState(parsed.theme);
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

  // apply globals
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.appTheme = theme; // data-app-theme="glass-dark|glass-contrast|neon"
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
  }, [theme, accent]);

  const setTheme = (t) => setThemeState(t);
  const setAccent = (a) => setAccentState(a);
  const reset = () => {
    setThemeState(defaultState.theme);
    setAccentState(defaultState.accent);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const value = useMemo(() => ({ theme, accent, setTheme, setAccent, reset }), [theme, accent]);

  return <PersonalizationContext.Provider value={value}>{children}</PersonalizationContext.Provider>;
};

export const usePersonalization = () => useContext(PersonalizationContext);