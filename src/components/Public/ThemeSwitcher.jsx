import React from 'react';
import { usePersonalization, THEME_PRESETS } from '../../context/PersonalizationContext';

export default function ThemeSwitcher() {
  const { theme, setTheme, cycleTheme } = usePersonalization();

  return (
    <div className="flex items-center gap-2">
      <button
        aria-label="Cycle Theme"
        onClick={cycleTheme}
        className="px-3 py-1.5 rounded-md text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200"
      >
        {theme.replace('-', ' ')}
      </button>
      <div className="hidden sm:flex items-center gap-1">
        {THEME_PRESETS.map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            aria-label={`Switch to ${t}`}
            className={`w-6 h-6 rounded-full border ${
              theme === t ? 'border-cyan-400 shadow-[0_0_10px_#00e5ff]' : 'border-white/20'
            }`}
            title={t}
            style={{
              background:
                t === 'neon'
                  ? 'conic-gradient(from 0deg, #00e5ff, #8a2be2, #00e5ff)'
                  : t === 'glass-contrast'
                  ? 'linear-gradient(135deg,#0b1220,#0f172a)'
                  : 'linear-gradient(135deg,#0f172a,#1e293b)',
            }}
          />
        ))}
      </div>
    </div>
  );
}