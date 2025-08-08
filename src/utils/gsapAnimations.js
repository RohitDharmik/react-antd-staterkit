/* eslint-disable no-unused-vars */
// gsapAnimations.js
// Reusable GSAP animations with ScrollTrigger for futuristic UI
// Now respects prefers-reduced-motion and minimizes motion-heavy effects.

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;
function ensureRegister() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

const prefersReduced = typeof window !== 'undefined'
  ? window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true
  : false;

export const gsapAnimations = {
  // Fade and slide up on enter
  fadeInUp(targets, opts = {}) {
    ensureRegister();
    const {
      delay = 0,
      duration = prefersReduced ? 0 : 0.9,
      y = prefersReduced ? 0 : 24,
      stagger = prefersReduced ? 0 : 0.08,
      ease = 'power3.out',
      once = true,
      trigger = null,
      start = 'top 85%',
      scrub = false,
    } = opts;

    const timelineOpts = prefersReduced
      ? {}
      : {
          scrollTrigger: trigger
            ? {
                trigger,
                start,
                toggleActions: once ? 'play none none none' : 'play reset play reset',
                scrub,
              }
            : undefined,
        };

    const tl = gsap.timeline(timelineOpts);

    tl.fromTo(
      targets,
      { autoAlpha: 0, y },
      { autoAlpha: 1, y: 0, duration: Math.max(0.001, duration), delay, stagger, ease }
    );

    return tl;
  },

  // Slight scale-in for cards
  scaleIn(targets, opts = {}) {
    ensureRegister();
    const {
      delay = 0,
      duration = prefersReduced ? 0 : 0.7,
      from = prefersReduced ? 1 : 0.95,
      ease = 'power2.out',
      stagger = prefersReduced ? 0 : 0.06,
      trigger = null,
      start = 'top 90%',
      once = true,
    } = opts;

    const timelineOpts = prefersReduced
      ? {}
      : {
          scrollTrigger: trigger
            ? {
                trigger,
                start,
                toggleActions: once ? 'play none none none' : 'play reset play reset',
              }
            : undefined,
        };

    const tl = gsap.timeline(timelineOpts);

    tl.fromTo(
      targets,
      { autoAlpha: 0, scale: from, y: prefersReduced ? 0 : 8, filter: prefersReduced ? 'none' : 'blur(2px)' },
      { autoAlpha: 1, scale: 1, y: 0, filter: 'none', duration: Math.max(0.001, duration), delay, ease, stagger }
    );

    return tl;
  },

  // Floating subtle y animation for hover/idle
  float(targets, opts = {}) {
    ensureRegister();
    if (prefersReduced) {
      // no continuous motion
      return gsap.to(targets, { y: '+=0', duration: 0.001 });
    }
    const { y = 8, duration = 2.5, ease = 'sine.inOut', delay = 0 } = opts;
    return gsap.to(targets, {
      yoyo: true,
      repeat: -1,
      delay,
      y: `+=${y}`,
      duration,
      ease,
    });
  },

  // Navbar hover glow
  navGlow(target, opts = {}) {
    ensureRegister();
    const { colorFrom = 'rgba(0,229,255,0.0)', colorTo = 'rgba(0,229,255,0.35)', duration = prefersReduced ? 0 : 0.35 } = opts;
    const enter = () =>
      gsap.to(target, { boxShadow: `0 0 16px 2px ${colorTo}`, duration, ease: 'power2.out' });
    const leave = () =>
      gsap.to(target, { boxShadow: `0 0 0px 0px ${colorFrom}`, duration, ease: 'power2.out' });
    return { enter, leave };
  },

  // Card hover tilt/orbit utility for Features
  hoverTilt(target, opts = {}) {
    ensureRegister();
    if (prefersReduced) {
      return { onEnter: () => {}, onLeave: () => {} };
    }
    const { rotate = 6, scale = 1.02 } = opts;
    const onEnter = () => gsap.to(target, { rotateX: -rotate, rotateY: rotate, scale, duration: 0.35, ease: 'power2.out' });
    const onLeave = () => gsap.to(target, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.45, ease: 'power2.out' });
    return { onEnter, onLeave };
  },

  orbitIcons(container, opts = {}) {
    ensureRegister();
    if (prefersReduced) return;
    const { radius = 48, duration = 6, selectors = [] } = opts;
    selectors.forEach((sel, idx) => {
      const el = typeof sel === 'string' ? container.querySelector(sel) : sel;
      if (!el) return;
      gsap.to(el, {
        motionPath: {
          path: `M ${radius} 0 A ${radius} ${radius} 0 1 1 -${radius} 0 A ${radius} ${radius} 0 1 1 ${radius} 0`,
          autoRotate: false,
        },
        duration: duration + idx,
        ease: 'none',
        repeat: -1,
      });
    });
  },

  // Section reveal orchestrator
  initScrollAnimations(root = document) {
    ensureRegister();

    const q = (sel) => (root instanceof Element ? root.querySelectorAll(sel) : document.querySelectorAll(sel));

    // hero
    this.fadeInUp('.hero-title', { trigger: '.hero', start: 'top 80%' });
    this.fadeInUp('.hero-sub', { delay: 0.1, trigger: '.hero', start: 'top 80%' });
    this.scaleIn('.hero-cta', { delay: 0.15, trigger: '.hero', start: 'top 80%' });

    // generic sections
    q('[data-animate="fade-up"]').forEach((el) => this.fadeInUp(el, { trigger: el }));
    q('[data-animate="scale-in"]').forEach((el) => this.scaleIn(el, { trigger: el }));
  },
};

export default gsapAnimations;