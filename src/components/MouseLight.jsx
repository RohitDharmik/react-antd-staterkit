import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const supportsReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;

const isTouch = () =>
  typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

const MouseLight = () => {
  const lightRef = useRef(null);
  const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const pending = useRef(false);
  const rafId = useRef(0);
  const tweenRef = useRef(null);

  useEffect(() => {
    if (supportsReducedMotion() || isTouch()) return;

    const el = lightRef.current;
    if (!el) return;

    // Ensure the element is positioned in the topmost stacking context
    document.body.appendChild(el);
    // Force stacking context above app shells just in case
    el.style.zIndex = '9999';

    // GSAP quickSetter for performant transforms
    const setX = gsap.quickSetter(el, 'x', 'px');
    const setY = gsap.quickSetter(el, 'y', 'px');

    // Position to center initially so something is visible before first mousemove
    setX(pos.current.x);
    setY(pos.current.y);
    gsap.set(el, { autoAlpha: 0.9 }); // slightly visible

    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (pending.current) return;
      pending.current = true;

      rafId.current = requestAnimationFrame(() => {
        pending.current = false;
        tweenRef.current?.kill();
        const curX = Number(gsap.getProperty(el, 'x')) || pos.current.x;
        const curY = Number(gsap.getProperty(el, 'y')) || pos.current.y;
        tweenRef.current = gsap.to({ cx: curX, cy: curY }, {
          cx: pos.current.x,
          cy: pos.current.y,
          duration: 0.25,
          ease: 'power3.out',
          onUpdate: function () {
            setX(this.targets()[0].cx);
            setY(this.targets()[0].cy);
          },
        });
      });
    };

    const show = () => {
      gsap.to(el, { autoAlpha: 1, duration: 0.15, ease: 'power2.out' });
    };
    const hide = () => {
      gsap.to(el, { autoAlpha: 0.85, duration: 0.2, ease: 'power2.out' }); // keep faint trail
    };

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseenter', show);
    window.addEventListener('mouseleave', hide);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseenter', show);
      window.removeEventListener('mouseleave', hide);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      tweenRef.current?.kill();
      gsap.killTweensOf(el);
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    };
  }, []);

  return (
    <div
      ref={lightRef}
      className="mouse-light-overlay pointer-events-none"
      aria-hidden="true"
      role="presentation"
    />
  );
};

export default MouseLight;