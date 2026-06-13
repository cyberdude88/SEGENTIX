"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import clsx from "clsx";
import * as THREE from "three";

export type SignalKind =
  | "fde"
  | "consulting"
  | "ai-security"
  | "leadership"
  | "offensive"
  | "training"
  | "coaching";

export type SignalLabel = {
  shortLabel: string;
  icon: ReactNode;
  position: [number, number, number];
  kind: SignalKind;
};

function seededNoise(i: number) {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/* ---------- Particle field — round, additive, depth-varied ---------- */

const particleVertex = /* glsl */ `
  attribute float aSize;
  attribute float aBrightness;
  attribute float aPhase;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uHoverBoost;
  varying float vBrightness;
  varying float vTwinkle;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    float twinkle = 0.55 + 0.45 * sin(uTime * 1.2 + aPhase * 6.2831);
    vTwinkle = twinkle;
    vBrightness = aBrightness * (1.0 + uHoverBoost * 0.35);
    gl_PointSize = aSize * uPixelRatio * (240.0 / -mvPosition.z);
  }
`;

const particleFragment = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  uniform vec3 uHighlight;
  varying float vBrightness;
  varying float vTwinkle;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.0, d);
    float glow = pow(max(0.0, 1.0 - d * 2.0), 2.6);
    vec3 col = mix(uColor, uHighlight, vTwinkle * 0.65) * vBrightness;
    float alpha = (core * 0.32 + glow * 0.78) * vBrightness * vTwinkle;
    gl_FragColor = vec4(col, alpha);
  }
`;

function ParticleLayer({
  count,
  spreadX,
  spreadY,
  spreadZ,
  depth,
  sizeRange,
  brightnessRange,
  rotation,
  parallaxStrength,
  color,
  highlight,
  hoverActive,
}: {
  count: number;
  spreadX: number;
  spreadY: number;
  spreadZ: number;
  depth: number;
  sizeRange: [number, number];
  brightnessRange: [number, number];
  rotation: number;
  parallaxStrength: number;
  color: string;
  highlight: string;
  hoverActive: { current: number };
}) {
  const ref = useRef<THREE.Points>(null);

  const { positions, sizes, brightness, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    const bri = new Float32Array(count);
    const pha = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const s1 = seededNoise(i * 9 + 1 + count);
      const s2 = seededNoise(i * 9 + 2 + count);
      const s3 = seededNoise(i * 9 + 3 + count);
      const s4 = seededNoise(i * 9 + 4 + count);
      const s5 = seededNoise(i * 9 + 5 + count);
      pos[i * 3] = (s1 - 0.5) * spreadX;
      pos[i * 3 + 1] = (s2 - 0.5) * spreadY;
      pos[i * 3 + 2] = depth + (s3 - 0.5) * spreadZ;
      // Heavy bias toward small particles so the field reads as a deep dust cloud
      const sizeT = s4 * s4 * s4;
      siz[i] = sizeRange[0] + sizeT * (sizeRange[1] - sizeRange[0]);
      bri[i] = brightnessRange[0] + s5 * (brightnessRange[1] - brightnessRange[0]);
      pha[i] = seededNoise(i * 9 + 6 + count);
    }
    return { positions: pos, sizes: siz, brightness: bri, phases: pha };
  }, [count, spreadX, spreadY, spreadZ, depth, sizeRange, brightnessRange]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: {
        value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1,
      },
      uColor: { value: new THREE.Color(color) },
      uHighlight: { value: new THREE.Color(highlight) },
      uHoverBoost: { value: 0 },
    }),
    [color, highlight]
  );

  useFrame(({ pointer, clock }, delta) => {
    const points = ref.current;
    if (!points) return;
    const t = clock.getElapsedTime();
    uniforms.uTime.value = t;
    uniforms.uHoverBoost.value = THREE.MathUtils.lerp(
      uniforms.uHoverBoost.value,
      hoverActive.current,
      0.06
    );
    points.rotation.y += delta * rotation;
    points.rotation.x = THREE.MathUtils.lerp(
      points.rotation.x,
      pointer.y * -0.04,
      0.03
    );
    points.position.x = THREE.MathUtils.lerp(
      points.position.x,
      pointer.x * parallaxStrength,
      0.045
    );
    points.position.y = THREE.MathUtils.lerp(
      points.position.y,
      pointer.y * parallaxStrength * 0.55,
      0.045
    );
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aBrightness" args={[brightness, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={particleVertex}
        fragmentShader={particleFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ParticleField({ hoverActive }: { hoverActive: { current: number } }) {
  return (
    <>
      {/* Far haze */}
      <ParticleLayer
        count={1700}
        spreadX={34}
        spreadY={22}
        spreadZ={2}
        depth={-7}
        sizeRange={[0.4, 1.0]}
        brightnessRange={[0.12, 0.4]}
        rotation={0.005}
        parallaxStrength={0.18}
        color="#1a6fa3"
        highlight="#4cc9ff"
        hoverActive={hoverActive}
      />
      {/* Mid layer */}
      <ParticleLayer
        count={950}
        spreadX={22}
        spreadY={13}
        spreadZ={3}
        depth={-2.5}
        sizeRange={[0.5, 1.55]}
        brightnessRange={[0.35, 0.75]}
        rotation={0.012}
        parallaxStrength={0.45}
        color="#4cc9ff"
        highlight="#cbeaff"
        hoverActive={hoverActive}
      />
      {/* Near sparkle */}
      <ParticleLayer
        count={260}
        spreadX={14}
        spreadY={8}
        spreadZ={2.6}
        depth={1.4}
        sizeRange={[0.8, 2.4]}
        brightnessRange={[0.6, 1.0]}
        rotation={0.022}
        parallaxStrength={0.9}
        color="#cbeaff"
        highlight="#ffffff"
        hoverActive={hoverActive}
      />
    </>
  );
}

/* ---------- Volumetric nebula fog ---------- */

function makeNebulaTexture(inner: string, mid: string) {
  if (typeof document === "undefined") return null;
  const size = 256;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, inner);
  g.addColorStop(0.45, mid);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

function NebulaFog() {
  const cyan = useMemo(
    () =>
      makeNebulaTexture("rgba(140, 220, 255, 0.55)", "rgba(76, 201, 255, 0.16)"),
    []
  );
  const violet = useMemo(
    () =>
      makeNebulaTexture("rgba(180, 140, 255, 0.45)", "rgba(120, 90, 220, 0.14)"),
    []
  );

  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  const c = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (a.current) {
      a.current.position.x = -2.4 + Math.sin(t * 0.045) * 1.4;
      a.current.position.y = 0.4 + Math.cos(t * 0.055) * 1.0;
      a.current.rotation.z = t * 0.005;
    }
    if (b.current) {
      b.current.position.x = 2.6 + Math.cos(t * 0.04) * 1.6;
      b.current.position.y = -0.7 + Math.sin(t * 0.05) * 1.2;
      b.current.rotation.z = -t * 0.0065;
    }
    if (c.current) {
      c.current.position.y = 0.1 + Math.sin(t * 0.03) * 0.6;
      c.current.rotation.z = t * 0.0035;
    }
  });

  if (!cyan || !violet) return null;

  return (
    <group>
      <mesh ref={c} position={[0, 0.1, -9]}>
        <planeGeometry args={[28, 17]} />
        <meshBasicMaterial
          map={cyan}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.22}
        />
      </mesh>
      <mesh ref={a} position={[-2.4, 0.4, -6]}>
        <planeGeometry args={[14, 10]} />
        <meshBasicMaterial
          map={cyan}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.5}
        />
      </mesh>
      <mesh ref={b} position={[2.6, -0.7, -7.5]}>
        <planeGeometry args={[16, 12]} />
        <meshBasicMaterial
          map={violet}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.42}
        />
      </mesh>
    </group>
  );
}

/* ---------- Service rooms — tiny per-label 3D vignettes ---------- */

function useStrokeGeometry(points: ReadonlyArray<[number, number, number]>) {
  return useMemo(() => {
    const arr = new Float32Array(points.length * 3);
    for (let i = 0; i < points.length; i++) {
      arr[i * 3] = points[i][0];
      arr[i * 3 + 1] = points[i][1];
      arr[i * 3 + 2] = points[i][2];
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [points]);
}

type ActiveRef = { value: number };

/* Each room uses a ref to its `<group>` and walks descendants once per frame
   to update material opacity. No React re-renders for hover/select changes. */
function applyOpacity(group: THREE.Object3D | null, fn: (mat: THREE.Material, mesh: THREE.Object3D) => void) {
  if (!group) return;
  group.traverse((child) => {
    const obj = child as THREE.Mesh & { material?: THREE.Material | THREE.Material[] };
    const mat = obj.material;
    if (!mat) return;
    if (Array.isArray(mat)) {
      mat.forEach((m) => fn(m, obj));
    } else {
      fn(mat, obj);
    }
  });
}

function Strokes({
  segments,
  color = "#4cc9ff",
}: {
  segments: ReadonlyArray<[number, number, number]>;
  color?: string;
}) {
  const geom = useStrokeGeometry(segments);
  return (
    <lineSegments geometry={geom}>
      <lineBasicMaterial color={color} transparent opacity={1} />
    </lineSegments>
  );
}

function Node({
  position,
  size = 0.06,
  color = "#cbeaff",
}: {
  position: [number, number, number];
  size?: number;
  color?: string;
}) {
  return (
    <mesh position={position} userData={{ nodeBoost: 0.15 }}>
      <sphereGeometry args={[size, 12, 10]} />
      <meshBasicMaterial color={color} transparent opacity={1} />
    </mesh>
  );
}

/* Each room renders within ~0.7 radius. `activeRef.value` ∈ [0,1] drives
   intensity at frame-time — materials are mutated directly so no re-renders. */

function RoomFDE({ activeRef }: { activeRef: ActiveRef }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }, delta) => {
    const g = ref.current;
    if (!g) return;
    const a = activeRef.value;
    g.rotation.y += delta * (0.18 + a * 0.25);
    g.position.y = Math.sin(clock.getElapsedTime() * 0.7) * 0.04;
    const op = 0.25 + a * 0.6;
    applyOpacity(g, (mat, mesh) => {
      const baseScale = (mesh as THREE.Mesh).userData.opScale ?? 1;
      (mat as THREE.MeshBasicMaterial).opacity = op * baseScale;
    });
  });
  const bars = [0, 1, 2, 3, 4, 5];
  return (
    <group ref={ref}>
      {bars.map((i) => {
        const w = 0.25 + (i % 3) * 0.18 + (i > 3 ? 0.1 : 0);
        return (
          <mesh key={i} position={[w * 0.5 - 0.2, (i - 2.5) * 0.13, 0]} userData={{ opScale: 1 }}>
            <boxGeometry args={[w, 0.025, 0.025]} />
            <meshBasicMaterial color="#4cc9ff" transparent opacity={1} />
          </mesh>
        );
      })}
      <mesh rotation={[0, 0, Math.PI * 0.1]} userData={{ opScale: 0.85 }}>
        <torusGeometry args={[0.7, 0.008, 6, 48, Math.PI * 1.35]} />
        <meshBasicMaterial color="#cbeaff" transparent opacity={1} />
      </mesh>
    </group>
  );
}

function RoomConsulting({ activeRef }: { activeRef: ActiveRef }) {
  const ref = useRef<THREE.Group>(null);
  const satellites = useMemo<[number, number, number][]>(
    () => [
      [0.55, 0.3, 0.05],
      [-0.45, 0.45, -0.08],
      [0.5, -0.4, 0.1],
      [-0.55, -0.25, 0.0],
      [0.0, 0.6, -0.05],
      [0.0, -0.6, 0.12],
    ],
    []
  );
  const segs = useMemo<[number, number, number][]>(() => {
    const s: [number, number, number][] = [];
    satellites.forEach((p) => {
      s.push([0, 0, 0], p);
    });
    return s;
  }, [satellites]);
  useFrame(({ clock }, delta) => {
    const g = ref.current;
    if (!g) return;
    const a = activeRef.value;
    g.rotation.z += delta * (0.08 + a * 0.18);
    g.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.18;
    const op = 0.3 + a * 0.55;
    applyOpacity(g, (mat, mesh) => {
      const s = (mesh as THREE.Mesh).userData.opScale ?? 1;
      (mat as THREE.MeshBasicMaterial).opacity = op * s;
    });
  });
  return (
    <group ref={ref}>
      <group userData={{ opScale: 0.9 }}>
        <Strokes segments={segs} color="#4cc9ff" />
      </group>
      <mesh userData={{ opScale: 1.15 }}>
        <sphereGeometry args={[0.09, 14, 12]} />
        <meshBasicMaterial color="#cbeaff" transparent opacity={1} />
      </mesh>
      {satellites.map((p, i) => (
        <mesh key={i} position={p} userData={{ opScale: 1 }}>
          <sphereGeometry args={[0.05, 12, 10]} />
          <meshBasicMaterial color="#cbeaff" transparent opacity={1} />
        </mesh>
      ))}
      <mesh userData={{ opScale: 0.4 }}>
        <torusGeometry args={[0.68, 0.006, 6, 60]} />
        <meshBasicMaterial color="#cbeaff" transparent opacity={1} />
      </mesh>
    </group>
  );
}

function RoomAI({ activeRef }: { activeRef: ActiveRef }) {
  const ref = useRef<THREE.Group>(null);
  const shieldRef = useRef<THREE.Mesh>(null);
  const { nodes, segs } = useMemo(() => {
    const cols = [-0.35, 0, 0.35];
    const rows = [-0.3, 0, 0.3];
    const n: [number, number, number][] = [];
    cols.forEach((x) => rows.forEach((y) => n.push([x, y, 0])));
    const s: [number, number, number][] = [];
    for (let c = 0; c < cols.length - 1; c++) {
      for (let r1 = 0; r1 < rows.length; r1++) {
        for (let r2 = 0; r2 < rows.length; r2++) {
          s.push([cols[c], rows[r1], 0], [cols[c + 1], rows[r2], 0]);
        }
      }
    }
    return { nodes: n, segs: s };
  }, []);
  useFrame(({ clock }, delta) => {
    const g = ref.current;
    if (!g) return;
    const a = activeRef.value;
    g.rotation.y = Math.sin(clock.getElapsedTime() * 0.4) * 0.3;
    if (shieldRef.current) shieldRef.current.rotation.z += delta * (0.25 + a * 0.5);
    const op = 0.3 + a * 0.55;
    applyOpacity(g, (mat, mesh) => {
      const s = (mesh as THREE.Mesh).userData.opScale ?? 1;
      (mat as THREE.MeshBasicMaterial).opacity = op * s;
    });
  });
  return (
    <group ref={ref}>
      <group userData={{ opScale: 0.55 }}>
        <Strokes segments={segs} color="#4cc9ff" />
      </group>
      {nodes.map((p, i) => (
        <mesh key={i} position={p} userData={{ opScale: 1.1 }}>
          <sphereGeometry args={[0.045, 12, 10]} />
          <meshBasicMaterial color="#cbeaff" transparent opacity={1} />
        </mesh>
      ))}
      <mesh ref={shieldRef} userData={{ opScale: 0.85 }}>
        <torusGeometry args={[0.66, 0.009, 6, 64, Math.PI * 1.7]} />
        <meshBasicMaterial color="#cbeaff" transparent opacity={1} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} userData={{ opScale: 0.4 }}>
        <torusGeometry args={[0.58, 0.005, 4, 48]} />
        <meshBasicMaterial color="#4cc9ff" transparent opacity={1} />
      </mesh>
    </group>
  );
}

function RoomLeadership({ activeRef }: { activeRef: ActiveRef }) {
  const ref = useRef<THREE.Group>(null);
  const clouds = useMemo<[number, number, number][]>(
    () => [
      [-0.5, 0.25, 0.0],
      [0.55, 0.3, -0.05],
      [-0.35, -0.35, 0.1],
      [0.4, -0.4, 0.08],
      [0, 0, -0.05],
    ],
    []
  );
  const segs = useMemo<[number, number, number][]>(() => {
    const s: [number, number, number][] = [];
    for (let i = 0; i < clouds.length; i++) {
      for (let j = i + 1; j < clouds.length; j++) {
        s.push(clouds[i], clouds[j]);
      }
    }
    return s;
  }, [clouds]);
  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    const a = activeRef.value;
    g.rotation.y = clock.getElapsedTime() * 0.12;
    const op = 0.3 + a * 0.55;
    applyOpacity(g, (mat, mesh) => {
      const s = (mesh as THREE.Mesh).userData.opScale ?? 1;
      (mat as THREE.MeshBasicMaterial).opacity = op * s;
    });
  });
  return (
    <group ref={ref}>
      <group userData={{ opScale: 0.35 }}>
        <Strokes segments={segs} color="#4cc9ff" />
      </group>
      {clouds.map((p, i) => (
        <group key={i} position={p}>
          <mesh userData={{ opScale: 0.45 }}>
            <sphereGeometry args={[0.11, 14, 12]} />
            <meshBasicMaterial color="#cbeaff" transparent opacity={1} />
          </mesh>
          <mesh position={[0.08, 0.04, 0]} userData={{ opScale: 0.35 }}>
            <sphereGeometry args={[0.07, 10, 8]} />
            <meshBasicMaterial color="#cbeaff" transparent opacity={1} />
          </mesh>
          <mesh position={[-0.07, 0.02, 0.02]} userData={{ opScale: 0.3 }}>
            <sphereGeometry args={[0.06, 10, 8]} />
            <meshBasicMaterial color="#cbeaff" transparent opacity={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function RoomOffensive({ activeRef }: { activeRef: ActiveRef }) {
  const ref = useRef<THREE.Group>(null);
  const baseY = useMemo<[number, number, number][]>(() => {
    const N = 56;
    const arr: [number, number, number][] = [];
    for (let i = 0; i < N - 1; i++) {
      const x1 = (i / (N - 1)) * 1.4 - 0.7;
      const x2 = ((i + 1) / (N - 1)) * 1.4 - 0.7;
      arr.push([x1, 0, 0], [x2, 0, 0]);
    }
    return arr;
  }, []);
  const geom = useStrokeGeometry(baseY);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const positions = geom.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      positions[i + 1] =
        Math.sin(x * 9 + t * 2.4) * 0.12 + Math.sin(x * 23 + t * 4.2) * 0.04;
    }
    geom.attributes.position.needsUpdate = true;
    const g = ref.current;
    if (!g) return;
    const a = activeRef.value;
    const op = 0.3 + a * 0.6;
    applyOpacity(g, (mat, mesh) => {
      const s = (mesh as THREE.Mesh).userData.opScale ?? 1;
      (mat as THREE.MeshBasicMaterial | THREE.LineBasicMaterial).opacity = op * s;
    });
  });
  return (
    <group ref={ref}>
      <lineSegments geometry={geom} userData={{ opScale: 1 }}>
        <lineBasicMaterial color="#4cc9ff" transparent opacity={1} />
      </lineSegments>
      <mesh position={[0, 0.35, 0]} userData={{ opScale: 0.85 }}>
        <ringGeometry args={[0.04, 0.06, 24]} />
        <meshBasicMaterial color="#ff5577" transparent opacity={1} />
      </mesh>
      <mesh position={[-0.45, -0.4, 0]} userData={{ opScale: 0.6 }}>
        <ringGeometry args={[0.03, 0.045, 20]} />
        <meshBasicMaterial color="#cbeaff" transparent opacity={1} />
      </mesh>
      <mesh position={[0.5, 0.3, 0]} userData={{ opScale: 0.6 }}>
        <ringGeometry args={[0.03, 0.045, 20]} />
        <meshBasicMaterial color="#cbeaff" transparent opacity={1} />
      </mesh>
      <group userData={{ opScale: 0.18 }}>
        <Strokes
          segments={[
            [-0.7, -0.55, 0],
            [0.7, -0.55, 0],
            [-0.7, 0.55, 0],
            [0.7, 0.55, 0],
          ]}
        />
      </group>
    </group>
  );
}

function RoomTraining({ activeRef }: { activeRef: ActiveRef }) {
  const ref = useRef<THREE.Group>(null);
  const { ring, outer, segs } = useMemo(() => {
    const r: [number, number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      r.push([Math.cos(a) * 0.55, Math.sin(a) * 0.55, 0]);
    }
    const o: [number, number, number][] = r.map((p) => [p[0] * 1.4, p[1] * 1.4, p[2]]);
    const s: [number, number, number][] = [];
    r.forEach((p, i) => {
      s.push([0, 0, 0], p);
      s.push(p, r[(i + 1) % r.length]);
    });
    o.forEach((p, i) => {
      s.push(r[i], p);
    });
    return { ring: r, outer: o, segs: s };
  }, []);
  useFrame(({ clock }, delta) => {
    const g = ref.current;
    if (!g) return;
    const a = activeRef.value;
    g.rotation.z += delta * (0.05 + a * 0.12);
    g.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.12;
    const op = 0.3 + a * 0.55;
    applyOpacity(g, (mat, mesh) => {
      const s = (mesh as THREE.Mesh).userData.opScale ?? 1;
      (mat as THREE.MeshBasicMaterial | THREE.LineBasicMaterial).opacity = op * s;
    });
  });
  return (
    <group ref={ref}>
      <group userData={{ opScale: 0.7 }}>
        <Strokes segments={segs} color="#4cc9ff" />
      </group>
      <mesh userData={{ opScale: 1.15 }}>
        <sphereGeometry args={[0.075, 14, 12]} />
        <meshBasicMaterial color="#cbeaff" transparent opacity={1} />
      </mesh>
      {ring.map((p, i) => (
        <mesh key={`r${i}`} position={p} userData={{ opScale: 1 }}>
          <sphereGeometry args={[0.045, 12, 10]} />
          <meshBasicMaterial color="#cbeaff" transparent opacity={1} />
        </mesh>
      ))}
      {outer.map((p, i) => (
        <mesh key={`o${i}`} position={p} userData={{ opScale: 0.7 }}>
          <sphereGeometry args={[0.025, 10, 8]} />
          <meshBasicMaterial color="#cbeaff" transparent opacity={1} />
        </mesh>
      ))}
    </group>
  );
}

function RoomCoaching({ activeRef }: { activeRef: ActiveRef }) {
  const ref = useRef<THREE.Group>(null);
  const a1 = useRef<THREE.Mesh>(null);
  const a2 = useRef<THREE.Mesh>(null);
  const a3 = useRef<THREE.Mesh>(null);
  useFrame(({ clock }, delta) => {
    const g = ref.current;
    if (!g) return;
    const a = activeRef.value;
    const t = clock.getElapsedTime();
    g.rotation.y = t * 0.18;
    if (a1.current) {
      a1.current.position.set(Math.cos(t * 0.9) * 0.5, Math.sin(t * 0.9) * 0.5, 0);
      a1.current.rotation.x += delta;
      a1.current.rotation.y += delta * 0.5;
    }
    if (a2.current) {
      a2.current.position.set(
        Math.cos(t * 0.6 + 2) * 0.45,
        Math.sin(t * 0.6 + 2) * -0.45,
        0.1
      );
      a2.current.rotation.z += delta * 0.6;
    }
    if (a3.current) {
      a3.current.position.set(
        Math.cos(t * 0.45 + 4) * 0.55,
        Math.sin(t * 0.45 + 4) * 0.55,
        -0.1
      );
      a3.current.rotation.x += delta * 0.4;
      a3.current.rotation.z += delta * 0.6;
    }
    const op = 0.3 + a * 0.55;
    applyOpacity(g, (mat, mesh) => {
      const s = (mesh as THREE.Mesh).userData.opScale ?? 1;
      (mat as THREE.MeshBasicMaterial).opacity = op * s;
    });
  });
  return (
    <group ref={ref}>
      <mesh userData={{ opScale: 0.4 }}>
        <sphereGeometry args={[0.18, 24, 18]} />
        <meshBasicMaterial color="#cbeaff" transparent opacity={1} />
      </mesh>
      <mesh userData={{ opScale: 0.85 }}>
        <icosahedronGeometry args={[0.22, 0]} />
        <meshBasicMaterial color="#4cc9ff" wireframe transparent opacity={1} />
      </mesh>
      <mesh ref={a1} userData={{ opScale: 0.9 }}>
        <octahedronGeometry args={[0.09, 0]} />
        <meshBasicMaterial color="#4cc9ff" wireframe transparent opacity={1} />
      </mesh>
      <mesh ref={a2} userData={{ opScale: 0.85 }}>
        <tetrahedronGeometry args={[0.1, 0]} />
        <meshBasicMaterial color="#cbeaff" wireframe transparent opacity={1} />
      </mesh>
      <mesh ref={a3} userData={{ opScale: 0.85 }}>
        <icosahedronGeometry args={[0.085, 0]} />
        <meshBasicMaterial color="#4cc9ff" wireframe transparent opacity={1} />
      </mesh>
    </group>
  );
}

function ServiceRoom({
  kind,
  position,
  activeRef,
}: {
  kind: SignalKind;
  position: [number, number, number];
  activeRef: ActiveRef;
}) {
  const wrapRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const a = activeRef.value;
    if (wrapRef.current) {
      const s = 0.85 + a * 0.2;
      wrapRef.current.scale.setScalar(s);
    }
    if (haloRef.current) {
      const m = haloRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.04 + a * 0.22;
    }
  });
  let inner: ReactNode = null;
  switch (kind) {
    case "fde":
      inner = <RoomFDE activeRef={activeRef} />;
      break;
    case "consulting":
      inner = <RoomConsulting activeRef={activeRef} />;
      break;
    case "ai-security":
      inner = <RoomAI activeRef={activeRef} />;
      break;
    case "leadership":
      inner = <RoomLeadership activeRef={activeRef} />;
      break;
    case "offensive":
      inner = <RoomOffensive activeRef={activeRef} />;
      break;
    case "training":
      inner = <RoomTraining activeRef={activeRef} />;
      break;
    case "coaching":
      inner = <RoomCoaching activeRef={activeRef} />;
      break;
  }
  return (
    <group ref={wrapRef} position={[position[0], position[1], position[2] - 0.35]}>
      <mesh ref={haloRef} position={[0, 0, -0.25]}>
        <circleGeometry args={[0.95, 36]} />
        <meshBasicMaterial
          color="#4cc9ff"
          transparent
          opacity={0.04}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {inner}
    </group>
  );
}

/* ---------- Subtle constellation rings ---------- */

function ConstellationRings() {
  const ref = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const isNarrow = viewport.width < 6;
  const baseZ = -2.6;

  useFrame(({ pointer, clock }, delta) => {
    const g = ref.current;
    if (!g) return;
    g.rotation.z -= delta * 0.01;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, pointer.x * 0.06, 0.025);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, pointer.y * -0.04, 0.025);
    g.position.z = baseZ + Math.sin(clock.getElapsedTime() * 0.18) * 0.12;
  });

  // Move rings out of the way on narrow viewports — they're decorative
  if (isNarrow) {
    return (
      <group
        ref={ref}
        position={[1.4, -0.6, baseZ]}
        scale={0.7}
        rotation={[Math.PI / 2.4, 0, 0]}
      >
        <mesh>
          <torusGeometry args={[2.2, 0.01, 8, 120, Math.PI * 1.4]} />
          <meshBasicMaterial color="#4cc9ff" transparent opacity={0.32} />
        </mesh>
        <mesh rotation={[0, 0, 0.7]}>
          <torusGeometry args={[3.0, 0.008, 8, 120, Math.PI * 1.3]} />
          <meshBasicMaterial color="#cbeaff" transparent opacity={0.22} />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={ref} position={[0, -0.4, baseZ]} scale={0.7}>
      {[2.6, 3.7, 4.9].map((r, i) => (
        <mesh key={r} rotation={[Math.PI / 2.1, 0, i * 0.45]}>
          <torusGeometry args={[r, 0.008, 8, 200, Math.PI * 1.55]} />
          <meshBasicMaterial
            color={i === 1 ? "#cbeaff" : "#4cc9ff"}
            transparent
            opacity={i === 1 ? 0.28 : 0.34}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Cinematic camera rig — idle drift + smooth fly ---------- */

function CameraRig({
  targetPos,
  hasTarget,
}: {
  targetPos: [number, number, number] | null;
  hasTarget: boolean;
}) {
  const origin = useMemo(() => new THREE.Vector3(0, 0, 7), []);
  const camTarget = useMemo(() => new THREE.Vector3(0, 0, 7), []);
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const lookCurrent = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (targetPos) {
      const label = new THREE.Vector3(targetPos[0], targetPos[1], targetPos[2]);
      const dir = label.clone().sub(origin);
      const len = dir.length();
      const stopBack = 2.6;
      const tt = len > stopBack ? (len - stopBack) / len : 0;
      camTarget.copy(origin).lerp(label, tt);
      // gentle parallax even when engaged
      camTarget.x += Math.sin(t * 0.4) * 0.04;
      camTarget.y += Math.cos(t * 0.32) * 0.03;
      lookTarget.copy(label);
    } else {
      // idle Lissajous drift + breathing on Z
      const driftX = Math.sin(t * 0.13) * 0.38 + Math.cos(t * 0.07) * 0.16;
      const driftY = Math.sin(t * 0.11) * 0.22 + Math.cos(t * 0.045) * 0.1;
      const breath = Math.sin(t * 0.21) * 0.28;
      camTarget.set(driftX, driftY * 0.6, 7 + breath);
      lookTarget.set(driftX * 0.4, driftY * 0.3, 0);
    }
    // critically-ish damped exponential approach — silky, never abrupt
    const speed = hasTarget ? 2.4 : 1.6;
    const k = 1 - Math.exp(-delta * speed);
    state.camera.position.lerp(camTarget, k);
    lookCurrent.lerp(lookTarget, k);
    state.camera.lookAt(lookCurrent);
  });

  return null;
}

/* ---------- Hover/select animation for service rooms ---------- */

function RoomLayer({
  labels,
  selectedIndex,
  hoveredIndex,
}: {
  labels: SignalLabel[];
  selectedIndex: number | null;
  hoveredIndex: number | null;
}) {
  // Stable ref-array per label. Each frame we lerp toward a per-label target.
  // Rooms read `.value` in their own useFrame — no React re-renders involved.
  const activeRefs = useRef<ActiveRef[]>([]);
  while (activeRefs.current.length < labels.length) {
    activeRefs.current.push({ value: 0 });
  }
  activeRefs.current.length = labels.length;

  useFrame((_, delta) => {
    const k = 1 - Math.exp(-delta * 5);
    for (let i = 0; i < labels.length; i++) {
      const isSel = selectedIndex === i;
      const isHover = hoveredIndex === i;
      const target = isSel ? 1 : isHover ? 0.7 : 0;
      activeRefs.current[i].value = THREE.MathUtils.lerp(
        activeRefs.current[i].value,
        target,
        k
      );
    }
  });

  return (
    <>
      {labels.map((l, i) => (
        <ServiceRoom
          key={`${l.shortLabel}-${i}`}
          kind={l.kind}
          position={l.position}
          activeRef={activeRefs.current[i]}
        />
      ))}
    </>
  );
}

/* ---------- Main component ---------- */

type Props = {
  className?: string;
  labels?: SignalLabel[];
  selectedIndex?: number | null;
  onSelect?: (index: number | null) => void;
  labelPortal?: RefObject<HTMLDivElement | null>;
};

export default function SignalParallax({
  className,
  labels,
  selectedIndex = null,
  onSelect,
  labelPortal,
}: Props) {
  const targetPos =
    selectedIndex != null && labels && labels[selectedIndex]
      ? labels[selectedIndex].position
      : null;

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Track hover globally for ambient particle response.
  const hoverActive = useRef(0);
  useEffect(() => {
    hoverActive.current = hoveredIndex != null || selectedIndex != null ? 1 : 0;
  }, [hoveredIndex, selectedIndex]);

  return (
    <div
      aria-hidden
      className={clsx(
        "signal-parallax pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 54 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, premultipliedAlpha: false }}
      >
        <NebulaFog />
        <ConstellationRings />
        <ParticleField hoverActive={hoverActive} />
        {labels && (
          <RoomLayer
            labels={labels}
            selectedIndex={selectedIndex}
            hoveredIndex={hoveredIndex}
          />
        )}
        <CameraRig targetPos={targetPos} hasTarget={targetPos !== null} />
        {labels?.map((label, i) => {
          const isSelected = selectedIndex === i;
          const isHovered = hoveredIndex === i;
          const isDimmed = selectedIndex != null && !isSelected;
          return (
            <Html
              key={`${label.shortLabel}-${i}`}
              position={label.position}
              center
              distanceFactor={9}
              zIndexRange={[20, 0]}
              portal={labelPortal as RefObject<HTMLElement> | undefined}
              style={{ pointerEvents: isSelected ? "none" : "auto" }}
            >
              <button
                type="button"
                aria-label={`Open ${label.shortLabel} details`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect?.(i);
                }}
                onPointerEnter={() => setHoveredIndex(i)}
                onPointerLeave={() =>
                  setHoveredIndex((current) => (current === i ? null : current))
                }
                onFocus={() => setHoveredIndex(i)}
                onBlur={() =>
                  setHoveredIndex((current) => (current === i ? null : current))
                }
                className={clsx(
                  "service-label hidden lg:inline-flex items-center gap-2 mono uppercase",
                  "tracking-[0.22em] text-[11px] px-3.5 py-2 whitespace-nowrap cursor-pointer",
                  "transition-all duration-500",
                  isSelected && "opacity-0",
                  !isSelected && isDimmed && "is-dim",
                  !isSelected && !isDimmed && isHovered && "is-hot",
                  !isSelected && !isDimmed && !isHovered && "is-idle"
                )}
              >
                <span className="service-label-icon">{label.icon}</span>
                <span>{label.shortLabel}</span>
                <span className="service-label-dot" aria-hidden />
              </button>
            </Html>
          );
        })}
      </Canvas>
      <div className="signal-parallax-vignette pointer-events-none" />
    </div>
  );
}
