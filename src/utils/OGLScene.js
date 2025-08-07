/* eslint-disable no-unused-vars */
// OGLScene.js
// Creates a neural-wave mesh with floating particles using OGL
// Mounts to a passed canvas element and provides start/stop/dispose APIs.

import { Renderer, Camera, Transform, Program, Mesh, Vec2, Vec3, Color, Geometry, Texture, Triangle } from 'ogl';

const vertex = `
attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform vec2 uMouse;
uniform float uAspect;

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

  // wave elevation using time + fbm
  float t = uTime * 0.2;
  float e = fbm(uv * 3.0 + t) * 0.6;
  // Mouse parallax displacement
  float parallax = (uMouse.x * (uv.x - 0.5) + uMouse.y * (uv.y - 0.5)) * 0.6;

  pos.z += e * 1.2 + parallax;

  vElevation = e;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragment = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColorA;
uniform vec3 uColorB;

varying vec2 vUv;
varying float vElevation;

void main() {
  // neon gradient blend
  float glow = smoothstep(0.0, 1.0, vElevation);
  vec3 base = mix(uColorA, uColorB, vUv.y + glow * 0.2);

  // subtle scanline effect
  float scan = sin((vUv.y + uTime * 0.2) * 50.0) * 0.04;
  base += scan;

  // vignette
  vec2 c = vUv - 0.5;
  float vig = 1.0 - dot(c, c) * 1.2;
  base *= vig;

  gl_FragColor = vec4(base, 0.9); // alpha < 1.0 to allow glassmorphism overlay
}
`;

function createPlane({ width = 2, height = 2, widthSegments = 80, heightSegments = 80 } = {}) {
  // Plane geometry in OGL
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

    this.onResize = this.onResize.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);

    if (canvas) this.init();
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

    this.onResize();
  }

  onPointerMove(e) {
    if (this.disposed || !this.canvas) return;
    const rect = this.canvas.getBoundingClientRect?.();
    if (!rect || !rect.width || !rect.height) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    // center and scale
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
      this.program.uniforms.uTime.value = (t - this.timeStart) / 1000;
      this.program.uniforms.uMouse.value.set(this.mouse.x, this.mouse.y);

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
    try {
      this.mesh?.program?.remove?.();
      this.mesh?.remove?.();
    } catch (e) {
      // noop
    }
    this.renderer = null;
    this.camera = null;
    this.scene = null;
    this.mesh = null;
    this.program = null;
    this.canvas = null;
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