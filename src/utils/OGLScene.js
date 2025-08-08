/* eslint-disable no-unused-vars */
// OGLScene.js
// Creates a neural-wave mesh with floating particles using OGL
// Mounts to a passed canvas element and provides start/stop/dispose APIs.
// Now respects prefers-reduced-motion and avoids forced audio or heavy motion.

import { Renderer, Camera, Transform, Program, Mesh, Vec2, Color, Geometry } from 'ogl';
import { gsap } from 'gsap';

const prefersReduced = typeof window !== 'undefined'
  ? window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true
  : false;

const vertex = `
attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform vec2 uMouse;
uniform float uAspect;
uniform float uAudioAmp;
uniform float uScrollPhase;

varying vec2 vUv;
varying float vElevation;

float noise(vec2 p){
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float fbm(vec2 p){
  float total = 0.0;
  float amplitude = 0.5;
  for(int i=0;i<5;i++){
    total += noise(p) * amplitude;
    p *= 2.0;
    amplitude *= 0.5;
  }
  return total;
}

void main() {
  vUv = uv;
  vec3 pos = position;

  float t = uTime * 0.25;
  // Wave frequency and amplitude modulated by scroll phase (0..1)
  float freq = mix(2.5, 4.5, uScrollPhase);
  float amp = mix(0.45, 0.9, uScrollPhase);

  float e = fbm(uv * freq + t) * amp;

  // Mouse parallax (reduced intensity if prefers-reduced-motion)
  float parallaxScale = ${'${'}prefersReduced ? '0.2' : '0.6'${'}'};
  float parallax = (uMouse.x * (uv.x - 0.5) + uMouse.y * (uv.y - 0.5)) * parallaxScale;

  // Audio reactive radial pulse centered, scaled by uAudioAmp (disabled if reduced)
  float d = distance(uv, vec2(0.5));
  float pulse = smoothstep(0.35, 0.0, d) * uAudioAmp * ${'${'}prefersReduced ? '0.0' : '1.0'${'}'};

  pos.z += e * 1.2 + parallax + pulse;

  vElevation = e + pulse * 0.5;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragment = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uScrollPhase;

varying vec2 vUv;
varying float vElevation;

void main() {
  float glow = smoothstep(0.0, 1.0, vElevation);
  // blend colors also by scroll phase for a cinematic shift
  vec3 base = mix(uColorA, uColorB, vUv.y + glow * 0.25 + uScrollPhase * 0.15);

  // scanlines (disabled when reduced motion preference is set by lowering amplitude)
  float scan = sin((vUv.y + uTime * 0.2) * 50.0) * ${'${'}prefersReduced ? '0.0' : '0.05'${'}'};
  base += scan;

  vec2 c = vUv - 0.5;
  float vig = 1.0 - dot(c, c) * 1.2;
  base *= vig;

  gl_FragColor = vec4(base, 0.9);
}
`;

function createPlane({ width = 2, height = 2, widthSegments = 80, heightSegments = 80 } = {}) {
  const geometry = new Geometry();
  const num = (widthSegments + 1) * (heightSegments + 1);
  const position = new Float32Array(num * 3);
  const uv = new Float32Array(num * 2);
  const index = [];

  let i = 0;
  for (let y = 0; y <= heightSegments; y++) {
    for (let x = 0; x <= widthSegments; x++) {
      const u = x / widthSegments;
      const v = y / heightSegments;

      position[i * 3 + 0] = (u - 0.5) * width;
      position[i * 3 + 1] = (v - 0.5) * height;
      position[i * 3 + 2] = 0;

      uv[i * 2 + 0] = u;
      uv[i * 2 + 1] = v;

      i++;
    }
  }

  for (let y = 0; y < heightSegments; y++) {
    for (let x = 0; x < widthSegments; x++) {
      const a = x + (widthSegments + 1) * y;
      const b = x + (widthSegments + 1) * (y + 1);
      const c = x + 1 + (widthSegments + 1) * (y + 1);
      const d = x + 1 + (widthSegments + 1) * y;

      index.push(a, b, d);
      index.push(b, c, d);
    }
  }

  geometry.addAttribute('position', { size: 3, data: position });
  geometry.addAttribute('uv', { size: 2, data: uv });
  geometry.addIndex({ data: new Uint32Array(index) });

  return geometry;
}

export class OGLScene {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = options;

    this.renderer = null;
    this.camera = null;
    this.scene = null;
    this.mesh = null;
    this.program = null;
    this.raf = null;
    this.timeStart = performance.now();
    this.mouse = { x: 0, y: 0 };
    this.disposed = false;

    // audio reactive fields
    this.micEnabled = false;
    this.audioAmp = 0;
    this.audioCtx = null;
    this.analyser = null;
    this.source = null;
    this.micStream = null;
    this.freqData = null;

    // gsap-driven uniform for page scroll/intro
    this.scrollPhase = { value: 0 }; // proxy object for gsap tweening

    this.onResize = this.onResize.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onMicToggle = this.onMicToggle.bind(this);

    if (canvas) this.init();
  }

  async onMicToggle(e) {
    const enabled = !!e.detail?.enabled;
    this.micEnabled = enabled && !prefersReduced;

    if (this.micEnabled) {
      try {
        if (!this.audioCtx) {
          this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.source = this.audioCtx.createMediaStreamSource(this.micStream);
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 256;
        this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
        this.source.connect(this.analyser);
      } catch (err) {
        console.warn('Mic init failed in OGLScene', err);
        this.micEnabled = false;
      }
    } else {
      try { this.source?.disconnect(); } catch {}
      try { this.micStream?.getTracks()?.forEach((t) => t.stop()); } catch {}
      this.source = null;
      this.analyser = null;
      this.micStream = null;
      this.freqData = null;
      this.audioAmp = 0;
    }
  }

  init() {
    const renderer = new Renderer({ canvas: this.canvas, alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio, 2) });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 20 });
    camera.position.set(0, 0, 6);

    const scene = new Transform();

    const geometry = createPlane({ width: 8, height: 5, widthSegments: 120, heightSegments: 80 });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new Vec2(0, 0) },
        uResolution: { value: new Vec2(1, 1) },
        uAspect: { value: 1 },
        uColorA: { value: new Color(this.options.colorA || '#00E5FF') },
        uColorB: { value: new Color(this.options.colorB || '#8A2BE2') },
        uAudioAmp: { value: 0 },
        uScrollPhase: { value: 0 },
      },
      transparent: true,
      cullFace: null,
    });

    const mesh = new Mesh(gl, { geometry, program });
    mesh.setParent(scene);

    this.renderer = renderer;
    this.camera = camera;
    this.scene = scene;
    this.mesh = mesh;
    this.program = program;

    window.addEventListener('resize', this.onResize);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('ncc:mic-enabled', this.onMicToggle);

    this.onResize();

    // GSAP intro timeline for cinematic background ramp-in (reduced duration if prefers-reduced-motion)
    try {
      gsap.fromTo(
        this.scrollPhase,
        { value: 0 },
        { value: 1, duration: prefersReduced ? 0 : 2.0, ease: 'power2.out' }
      );
    } catch {}
  }

  onPointerMove(e) {
    if (this.disposed || !this.canvas) return;
    const rect = this.canvas.getBoundingClientRect?.();
    if (!rect || !rect.width || !rect.height) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    this.mouse.x = (x - 0.5) * 2.0;
    this.mouse.y = (y - 0.5) * 2.0;
  }

  onResize() {
    if (this.disposed || !this.canvas || !this.renderer || !this.program || !this.camera) return;
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h);
    this.program.uniforms.uResolution.value.set(w, h);
    this.program.uniforms.uAspect.value = w / h;
    this.camera.perspective({ aspect: w / h });
  }

  start() {
    const loop = (t) => {
      // update audio amplitude
      if (this.micEnabled && this.analyser && this.freqData) {
        this.analyser.getByteFrequencyData(this.freqData);
        let sum = 0;
        const len = Math.min(32, this.freqData.length);
        for (let i = 0; i < len; i++) sum += this.freqData[i];
        const avg = sum / len / 255;
        this.audioAmp = this.audioAmp * 0.85 + avg * 0.15;
      } else {
        this.audioAmp *= 0.9;
        if (this.audioAmp < 0.001) this.audioAmp = 0;
      }

      this.program.uniforms.uTime.value = (t - this.timeStart) / 1000;
      this.program.uniforms.uMouse.value.set(this.mouse.x, this.mouse.y);
      this.program.uniforms.uAudioAmp.value = prefersReduced ? 0 : this.audioAmp;
      this.program.uniforms.uScrollPhase.value = this.scrollPhase.value;

      this.renderer.render({ scene: this.scene, camera: this.camera });
      this.raf = requestAnimationFrame(loop);
    };
    this.stop();
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = null;
    }
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.stop();
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('ncc:mic-enabled', this.onMicToggle);
    try { this.source?.disconnect(); } catch {}
    try { this.micStream?.getTracks()?.forEach((t) => t.stop()); } catch {}
    try { this.mesh?.program?.remove?.(); this.mesh?.remove?.(); } catch (e) {}
    this.renderer = null;
    this.camera = null;
    this.scene = null;
    this.mesh = null;
    this.program = null;
    this.canvas = null;
    this.audioCtx = null;
    this.analyser = null;
    this.source = null;
    this.micStream = null;
    this.freqData = null;
  }
}

// Convenience helper to mount on an element by id
export function mountOGL(canvasId = 'ogl-canvas', options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;
  const scene = new OGLScene(canvas, options);
  scene.start();
  return scene;
}