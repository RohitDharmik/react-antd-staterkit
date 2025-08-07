import React from 'react';
import Navbar from '../components/Public/Navbar';

/**
 * PublicLayout
 * - Common layout for public pages: Navbar + main content + footer
 * - Provides consistent paddings and background.
 */
const PublicLayout = ({ children, footer = true }) => {
  return (
    <div className="min-h-screen text-white relative overflow-x-hidden bg-slate-950">
      <Navbar />
      <main className="pt-24 pb-16">{children}</main>
      {footer && (
        <footer className="py-10 border-t border-white/10 bg-slate-950/60 backdrop-blur">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <p className="text-slate-400 text-sm">© {new Date().getFullYear()} Neural Command Center</p>
            <div className="flex gap-4 text-sm">
              <a href="/about" className="text-slate-300 hover:text-cyan-300">About</a>
              <a href="/docs" className="text-slate-300 hover:text-cyan-300">Docs</a>
              <a href="/contact" className="text-slate-300 hover:text-cyan-300">Contact</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default PublicLayout;
