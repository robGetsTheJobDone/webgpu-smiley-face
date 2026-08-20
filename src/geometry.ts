export interface Vertex {
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

export interface SmileyGeometry {
  readonly vertices: Float32Array<ArrayBuffer>;
  readonly vertexCount: number;
}

const YELLOW = [1, 0.78, 0.08] as const;
const INK = [0.12, 0.1, 0.08] as const;

function push(vertices: number[], point: readonly [number, number], color: readonly [number, number, number]): void {
  vertices.push(point[0], point[1], ...color);
}

function circle(vertices: number[], center: readonly [number, number], radius: number, color: readonly [number, number, number], segments: number): void {
  for (let index = 0; index < segments; index += 1) {
    const first = (index / segments) * Math.PI * 2;
    const second = ((index + 1) / segments) * Math.PI * 2;
    push(vertices, center, color);
    push(vertices, [center[0] + Math.cos(first) * radius, center[1] + Math.sin(first) * radius], color);
    push(vertices, [center[0] + Math.cos(second) * radius, center[1] + Math.sin(second) * radius], color);
  }
}

function smile(vertices: number[], segments = 40): void {
  const center: readonly [number, number] = [0, 0.02];
  const inner = 0.39;
  const outer = 0.47;
  const start = Math.PI * 0.18;
  const end = Math.PI * 0.82;
  for (let index = 0; index < segments; index += 1) {
    const first = start + ((end - start) * index) / segments;
    const second = start + ((end - start) * (index + 1)) / segments;
    const points = [
      [center[0] + Math.cos(first) * inner, center[1] - Math.sin(first) * inner],
      [center[0] + Math.cos(first) * outer, center[1] - Math.sin(first) * outer],
      [center[0] + Math.cos(second) * outer, center[1] - Math.sin(second) * outer],
      [center[0] + Math.cos(second) * inner, center[1] - Math.sin(second) * inner],
    ] as const;
    push(vertices, points[0], INK); push(vertices, points[1], INK); push(vertices, points[2], INK);
    push(vertices, points[0], INK); push(vertices, points[2], INK); push(vertices, points[3], INK);
  }
}

export function createSmileyGeometry(): SmileyGeometry {
  const values: number[] = [];
  circle(values, [0, 0], 0.82, YELLOW, 96);
  circle(values, [-0.29, 0.23], 0.105, INK, 32);
  circle(values, [0.29, 0.23], 0.105, INK, 32);
  smile(values);
  const vertices = new Float32Array(values);
  return { vertices, vertexCount: vertices.length / 5 };
}

export function canvasBackingSize(cssWidth: number, cssHeight: number, devicePixelRatio: number, maximumDimension: number): readonly [number, number] {
  const ratio = Math.max(1, Math.min(devicePixelRatio, 3));
  const scale = Math.min(1, maximumDimension / Math.max(cssWidth * ratio, cssHeight * ratio));
  return [Math.max(1, Math.round(cssWidth * ratio * scale)), Math.max(1, Math.round(cssHeight * ratio * scale))];
}
