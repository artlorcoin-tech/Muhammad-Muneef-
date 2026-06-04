import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { playSound } from '../lib/sound';

const vertexShaderSource = `
precision mediump float;
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = (a_position + 1.) / 2.;
  gl_Position = vec4(a_position, 0., 1.);
}
`;

const displayFragmentShaderSource = `
precision mediump float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_ratio;
uniform sampler2D u_displacement;
uniform sampler2D u_texture;
varying vec2 v_uv;

float smoothCircle(vec2 st, vec2 center, float radius) {
  return 1. - smoothstep(0., radius, distance(st, center));
}

void main() {
  vec2 uv = v_uv;
  uv.y = 1. - uv.y;
  vec2 mouse = u_mouse;
  mouse.y = 1. - mouse.y;
  vec2 displacement = texture2D(u_displacement, uv).rg;
  float mouseDistance = distance(uv, mouse);
  float c = .04 * smoothCircle(uv, mouse, .23);
  vec2 new_uv;
  new_uv.x = uv.x + displacement.r * c;
  new_uv.y = (uv.y - .04) - displacement.g * c;
  vec3 color = texture2D(u_texture, new_uv).rgb;
  color = mix(color, vec3(0.15, 0.15, 0.15), smoothCircle(uv, mouse, .012));
  gl_FragColor = vec4(color, 1.);
}
`;

const displacementFragmentShaderSource = `
precision mediump float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_mousePower;
uniform float u_mouseRadius;
uniform vec2 u_mouseDirection;
uniform sampler2D u_displacementTexture;

// Click shockwave uniforms
uniform vec2 u_clickPosition;
uniform float u_clickPower;

varying vec2 v_uv;

float l(vec2 uv, vec2 p, vec2 a, float r) {
  return min(1., pow(1. - abs(r - distance(uv, p)) / (r * .4), 6.)) * smoothstep(.0, .1, distance(a, vec2(0.)));
}

vec2 d(vec2 uv, vec2 p, vec2 a, float r, float aspect) {
  float L = l(uv, p, a, r);
  float dx = (L * a.x * (r - distance(vec2(uv.x / aspect, uv.y), p)) * (uv.x / aspect - p.x));
  float dy = (L * a.y * (r - distance(vec2(uv.x / aspect, uv.y), p)) * (uv.y - p.y));
  return vec2(dx, dy);
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / u_resolution.y;
  vec4 previous = texture2D(u_displacementTexture, uv);
  vec2 p = u_mouse;
  vec2 a = (vec2(.04) * (1. - u_mousePower * .25)) + previous.gb;
  vec2 mouseDirection = u_mouseDirection;
  a += d(uv, p, mouseDirection, u_mouseRadius, aspect);
  
  // Click shockwave displacement
  if (u_clickPower > 0.0) {
    float dist = distance(vec2(uv.x / aspect, uv.y), vec2(u_clickPosition.x / aspect, u_clickPosition.y));
    if (dist > 0.001) {
      float ripple = sin(dist * 35.0 - u_clickPower * 12.0) * exp(-dist * 3.5) * u_clickPower * 0.15;
      vec2 dir = normalize(vec2(uv.x / aspect, uv.y) - vec2(u_clickPosition.x / aspect, u_clickPosition.y));
      a += dir * ripple;
    }
  }

  float g = .7 + (.15 * sin(uv.y * 11. + previous.r * 2.) + .07 * sin(uv.y * 38. + previous.r * 3.)) * smoothstep(.4, .0, abs(uv.x - .5));
  a *= g;
  float t = previous.r;
  t += a.x + a.y;
  t += (sin(mod(uv.x, .07) * 50.) * sin(mod(uv.y, .07) * 50.)) * .05 * smoothstep(.3, .0, distance(uv, vec2(.5)));
  float k = (t - previous.r);
  float n = smoothstep(.1, .9, hash(vec2(t, previous.r))) * 2. - 1.;
  t += (k * n);
  gl_FragColor = vec4(t, a, 1.);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function createFramebuffer(gl: WebGLRenderingContext, w: number, h: number) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { texture, framebuffer };
}

export default function InkEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
    if (!gl) return;

    // Create shaders
    const vertShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const displayFragShader = createShader(gl, gl.FRAGMENT_SHADER, displayFragmentShaderSource);
    const displacementFragShader = createShader(gl, gl.FRAGMENT_SHADER, displacementFragmentShaderSource);
    if (!vertShader || !displayFragShader || !displacementFragShader) return;

    // Create programs
    const displayProgram = createProgram(gl, vertShader, displayFragShader);
    const displacementProgram = createProgram(gl, vertShader, displacementFragShader);
    if (!displayProgram || !displacementProgram) return;

    // Fullscreen triangle geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    // Create ping-pong framebuffers for displacement
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const dispW = Math.ceil(window.innerWidth * 0.25);
    const dispH = Math.ceil(window.innerHeight * 0.25);
    const displacementFB = [createFramebuffer(gl, dispW, dispH), createFramebuffer(gl, dispW, dispH)];

    // Mouse state
    const mouse = { x: -1, y: -1, prevX: -1, prevY: -1, velX: 0, velY: 0, active: false };
    const MOUSE_RADIUS = 1.0;

    // Click splash state
    const clickState = { x: -1, y: -1, power: 0.0 };

    // Load noise texture
    const noiseTexture = gl.createTexture();
    const noiseImage = new Image();
    noiseImage.crossOrigin = 'anonymous';
    noiseImage.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, noiseTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, noiseImage);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    };
    noiseImage.src = '/images/noise.jpg';

    // Resize handler
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    // Mouse handlers
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = 1.0 - (e.clientY / window.innerHeight);
      if (mouse.prevX >= 0) {
        mouse.velX = mouse.x - mouse.prevX;
        mouse.velY = mouse.y - mouse.prevY;
      }
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.active = true;
    };
    
    const onMouseLeave = () => {
      mouse.active = false;
    };

    // Mousedown listener for WebGL ripple click splash
    const onMouseDown = (e: MouseEvent) => {
      // Don't trigger if clicking on interactive items (like buttons, links, search input, etc)
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.interactive-item')
      ) {
        return;
      }

      clickState.x = e.clientX / window.innerWidth;
      clickState.y = 1.0 - (e.clientY / window.innerHeight);
      clickState.power = 1.0;

      // Animate shockwave power decay
      gsap.killTweensOf(clickState);
      gsap.to(clickState, {
        power: 0.0,
        duration: 1.4,
        ease: 'power2.out',
      });

      playSound('click');
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mousedown', onMouseDown);

    let flipFlop = false;
    let rafId: number;

    const animate = (time: number) => {
      rafId = requestAnimationFrame(animate);

      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspect = width / height;

      flipFlop = !flipFlop;

      // --- Displacement pass ---
      gl.bindFramebuffer(gl.FRAMEBUFFER, displacementFB[flipFlop ? 0 : 1].framebuffer);
      gl.viewport(0, 0, dispW, dispH);
      gl.useProgram(displacementProgram);

      // Bind previous displacement texture
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, displacementFB[flipFlop ? 1 : 0].texture);
      const uDispTexture = gl.getUniformLocation(displacementProgram, 'u_displacementTexture');
      gl.uniform1i(uDispTexture, 0);

      // Set uniforms
      const uMouseDisp = gl.getUniformLocation(displacementProgram, 'u_mouse');
      gl.uniform2f(uMouseDisp, mouse.x, mouse.y);

      const uMouseDirection = gl.getUniformLocation(displacementProgram, 'u_mouseDirection');
      gl.uniform2f(uMouseDirection, mouse.velX || 0, mouse.velY || 0);

      const uMousePower = gl.getUniformLocation(displacementProgram, 'u_mousePower');
      gl.uniform1f(uMousePower, 0.0);

      const uMouseRadius = gl.getUniformLocation(displacementProgram, 'u_mouseRadius');
      gl.uniform1f(uMouseRadius, MOUSE_RADIUS);

      const uDispResolution = gl.getUniformLocation(displacementProgram, 'u_resolution');
      gl.uniform2f(uDispResolution, dispW, dispH);

      // Bind click shockwave uniforms
      const uClickPos = gl.getUniformLocation(displacementProgram, 'u_clickPosition');
      gl.uniform2f(uClickPos, clickState.x, clickState.y);

      const uClickPower = gl.getUniformLocation(displacementProgram, 'u_clickPower');
      gl.uniform1f(uClickPower, clickState.power);

      // Draw fullscreen triangle
      const aPositionDisp = gl.getAttribLocation(displacementProgram, 'a_position');
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(aPositionDisp);
      gl.vertexAttribPointer(aPositionDisp, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // --- Display pass ---
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(displayProgram);

      // Bind displacement texture
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, displacementFB[flipFlop ? 0 : 1].texture);
      const uDisplacement = gl.getUniformLocation(displayProgram, 'u_displacement');
      gl.uniform1i(uDisplacement, 0);

      // Bind noise texture
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, noiseTexture);
      const uTexture = gl.getUniformLocation(displayProgram, 'u_texture');
      gl.uniform1i(uTexture, 1);

      // Set display uniforms
      const uMouseDisplay = gl.getUniformLocation(displayProgram, 'u_mouse');
      gl.uniform2f(uMouseDisplay, mouse.x, mouse.y);

      const uTime = gl.getUniformLocation(displayProgram, 'u_time');
      gl.uniform1f(uTime, time * 0.001);

      const uRatio = gl.getUniformLocation(displayProgram, 'u_ratio');
      gl.uniform1f(uRatio, aspect);

      const uDisplayResolution = gl.getUniformLocation(displayProgram, 'u_resolution');
      gl.uniform2f(uDisplayResolution, canvas.width, canvas.height);

      // Draw fullscreen triangle
      const aPositionDisplay = gl.getAttribLocation(displayProgram, 'a_position');
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(aPositionDisplay);
      gl.vertexAttribPointer(aPositionDisplay, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mousedown', onMouseDown);
      gl.deleteProgram(displayProgram);
      gl.deleteProgram(displacementProgram);
      gl.deleteShader(vertShader);
      gl.deleteShader(displayFragShader);
      gl.deleteShader(displacementFragShader);
      gl.deleteBuffer(positionBuffer);
      displacementFB.forEach(fb => {
        gl.deleteTexture(fb.texture);
        gl.deleteFramebuffer(fb.framebuffer);
      });
      gl.deleteTexture(noiseTexture);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
      }}
    />
  );
}
