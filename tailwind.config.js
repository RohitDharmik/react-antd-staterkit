/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slateglass: {
          900: "rgba(2,6,23,0.85)",
          800: "rgba(15,23,42,0.75)",
          700: "rgba(30,41,59,0.6)",
          600: "rgba(51,65,85,0.45)",
        },
        neon: {
          blue: "#3b82f6",
          purple: "#8b5cf6",
          cyan: "#22d3ee",
          green: "#10b981",
          amber: "#f59e0b",
          red: "#ef4444",
        },
      },
      backdropBlur: {
        xs: "2px",
        sm: "6px",
        md: "12px",
        lg: "20px",
        xl: "30px",
      },
      boxShadow: {
        glass: "0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        soft: "0 10px 30px rgba(0,0,0,0.35)",
        'neon-blue': "0 0 20px rgba(59,130,246,0.35)",
        'neon-purple': "0 0 20px rgba(139,92,246,0.35)",
        'inner-1': "inset 0 1px 0 rgba(255,255,255,0.06)",
      },
      borderRadius: {
        xl: "1rem",
        '2xl': "1.25rem",
        '3xl': "1.5rem",
      },
      backgroundImage: {
        'glass-dark': "linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(30,41,59,0.65) 100%)",
        'glass-accent': "linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.12) 100%)",
        'grid-faint': "linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)",
        'radial-spot': "radial-gradient(800px 400px at 80% 20%, rgba(59,130,246,0.2), transparent), radial-gradient(600px 300px at 20% 80%, rgba(139,92,246,0.2), transparent)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif"],
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSoft: {
          '0%, 100%': { boxShadow: '0 0 0 rgba(59,130,246,0.0)' },
          '50%': { boxShadow: '0 0 30px rgba(59,130,246,0.35)' },
        },
      },
    },
  },
  plugins: [],
};
