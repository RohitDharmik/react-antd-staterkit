/* eslint-disable no-unused-vars */
// gsapAnimations.js
// Reusable GSAP animations with ScrollTrigger for futuristic UI

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;
function ensureRegister() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

export const gsapAnimations = {
  // Fade and slide up on enter
  fadeInUp(targets, opts = {}) {
    ensureRegister();
    const {
      delay = 0,
      duration = 0.9,
      y = 24,
      stagger = 0.08,
      ease = 'power3.out',
      once = true,
      trigger = null,
      start = 'top 85%',
      scrub = false,
    } = opts;

    const tl = gsap.timeline({
      scrollTrigger: trigger
        ? {
            trigger,
            start,
            toggleActions: once ? 'play none none none' : 'play reset play reset',
            scrub,
          }
        : undefined,
    });

    tl.fromTo(
      targets,
      { autoAlpha: 0, y },
      { autoAlpha: 1, y: 0, duration, delay, stagger, ease }
    );

    return tl;
  },

  // Slight scale-in for cards
  scaleIn(targets, opts = {}) {
    ensureRegister();
    const {
      delay = 0,
      duration = 0.7,
      from = 0.95,
      ease = 'power2.out',
      stagger = 0.06,
      trigger = null,
      start = 'top 90%',
      once = true,
    } = opts;

    const tl = gsap.timeline({
      scrollTrigger: trigger
        ? {
            trigger,
            start,
            toggleActions: once ? 'play none none none' : 'play reset play reset',
          }
        : undefined,
    });

    tl.fromTo(
      targets,
      { autoAlpha: 0, scale: from, y: 8, filter: 'blur(2px)' },
      { autoAlpha: 1, scale: 1, y: 0, filter: 'blur(0px)', duration, delay, ease, stagger }
    );

    return tl;
  },

  // Floating subtle y animation for hover/idle
  float(targets, opts = {}) {
    ensureRegister();
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
    const { colorFrom = 'rgba(0,229,255,0.0)', colorTo = 'rgba(0,229,255,0.35)', duration = 0.35 } = opts;
    const enter = () =>
      gsap.to(target, { boxShadow: `0 0 16px 2px ${colorTo}`, duration, ease: 'power2.out' });
    const leave = () =>
      gsap.to(target, { boxShadow: `0 0 0px 0px ${colorFrom}`, duration, ease: 'power2.out' });
    return { enter, leave };
  },

  // Section reveal orchestrator
  initScrollAnimations() {
    ensureRegister();

    // hero
    this.fadeInUp('.hero-title', { trigger: '.hero', start: 'top 80%' });
    this.fadeInUp('.hero-sub', { delay: 0.1, trigger: '.hero', start: 'top 80%' });
    this.scaleIn('.hero-cta', { delay: 0.15, trigger: '.hero', start: 'top 80%' });

    // generic sections
    document.querySelectorAll('[data-animate="fade-up"]').forEach((el) => {
      this.fadeInUp(el, { trigger: el });
    });

    document.querySelectorAll('[data-animate="scale-in"]').forEach((el) => {
      this.scaleIn(el, { trigger: el });
    });
  },
};

export default gsapAnimations;