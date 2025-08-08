import React, { useEffect, useRef } from 'react';
import gsapAnimations from '../../utils/gsapAnimations';

export default function Docs() {
  const sidebarRef = useRef(null);

  useEffect(() => {
    gsapAnimations.initScrollAnimations();

    // Sticky sidebar highlight on scroll
    const links = sidebarRef.current?.querySelectorAll('a[data-doc-link]');
    const sections = document.querySelectorAll('section[data-doc-section]');
    function onScroll() {
      let activeId = null;
      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.35 && rect.bottom > window.innerHeight * 0.35) {
          activeId = sec.id;
        }
      });
      links?.forEach((a) => {
        const isActive = a.getAttribute('href') === `#${activeId}`;
        a.classList.toggle('text-cyan-300', isActive);
        a.classList.toggle('bg-cyan-400/10', isActive);
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const sections = [
    {
      id: 'overview',
      h: 'Overview',
      d: 'This documentation provides a high-level guide to the public interface, theming, and animation primitives. It intentionally avoids any private app logic.',
      code: `// Mount providers
import { PersonalizationProvider } from '../context/PersonalizationContext';
import { RouterProvider } from 'react-router-dom';

// App.jsx
<PersonalizationProvider>
  <RouterProvider router={router} />
</PersonalizationProvider>`,
    },
    {
      id: 'getting-started',
      h: 'Getting Started',
      d: 'Install dependencies, run the dev server, and explore the routes: /, /about, /features, /docs, /contact, /login.',
      code: `# install
npm i
# run dev
npm run dev`,
    },
    {
      id: 'ogl',
      h: 'OGL Background',
      d: 'The OGL shader scene provides a neural mesh with mic-reactive pulses and a GSAP-driven intro.',
      code: `import { OGLScene } from '../../utils/OGLScene';

const scene = new OGLScene(canvasRef.current, { colorA: '#00E5FF', colorB: '#8A2BE2' });
scene.start();`,
    },
    {
      id: 'gsap',
      h: 'GSAP Animations',
      d: 'Reusable animations are available in gsapAnimations: fadeInUp, scaleIn, float, hoverTilt, orbitIcons, and initScrollAnimations.',
      code: `import gsapAnimations from '../../utils/gsapAnimations';
useEffect(() => { gsapAnimations.initScrollAnimations(); }, []);`,
    },
    {
      id: 'styling',
      h: 'Styling',
      d: 'TailwindCSS with glassmorphism surfaces (backdrop blur, translucent panels) produces a futuristic UI.',
      code: `<div className="glass p-6">Glass Panel</div>`,
    },
    {
      id: 'accessibility',
      h: 'Accessibility',
      d: 'Focus styles, color contrast, and reduced-motion considerations are recommended for production.',
      code: `/* Neon focus helper in CSS */
.neon-focus { box-shadow: 0 0 0 3px color-mix(in oklab, var(--accent) 25%, transparent) }`,
    },
  ];

  return (
    <div>
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-[240px_1fr] gap-8">
        {/* Sticky sidebar */}
        <aside ref={sidebarRef} className="hidden md:block sticky top-24 h-max" data-animate="fade-up">
          <nav className="glass-panel p-3">
            <ul className="space-y-1">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    data-doc-link
                    href={`#${s.id}`}
                    className="block px-3 py-2 rounded-md text-sm text-slate-300 hover:text-cyan-300 hover:bg-cyan-400/5 transition"
                  >
                    {s.h}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <div>
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-cyan-200" data-animate="fade-up">Documentation</h1>
            <p className="mt-3 text-slate-300/90" data-animate="fade-up">
              Structure, animations, and theming for the public UI.
            </p>
          </header>

          <div className="space-y-8">
            {sections.map((s) => (
              <section
                key={s.id}
                id={s.id}
                data-doc-section
                data-animate="fade-up"
                className="glass-panel p-5"
              >
                <h3 className="text-cyan-200 font-semibold">{s.h}</h3>
                <p className="mt-2 text-slate-300/80">{s.d}</p>
                {s.code && (
                  <pre className="mt-3 overflow-x-auto rounded-lg bg-black/40 border border-white/10 p-4 text-xs text-cyan-100/90">
                    <code dangerouslySetInnerHTML={{ __html: s.code }} />
                  </pre>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}