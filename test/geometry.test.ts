import { describe, expect, it } from "vitest";
import { canvasBackingSize, createSmileyGeometry } from "../src/geometry.js";

describe("smiley geometry", () => {
  it("produces finite triangle vertices inside normalized clip space", () => {
    const geometry = createSmileyGeometry();
    expect(geometry.vertexCount).toBeGreaterThan(500);
    expect(geometry.vertexCount % 3).toBe(0);
    expect([...geometry.vertices].every(Number.isFinite)).toBe(true);
    for (let index = 0; index < geometry.vertices.length; index += 5) {
      expect(Math.abs(geometry.vertices[index] ?? 2)).toBeLessThanOrEqual(1);
      expect(Math.abs(geometry.vertices[index + 1] ?? 2)).toBeLessThanOrEqual(1);
    }
  });

  it("creates sharp high-DPI backing sizes while respecting GPU limits", () => {
    expect(canvasBackingSize(300, 200, 2, 4096)).toEqual([600, 400]);
    expect(canvasBackingSize(3000, 2000, 3, 4096)).toEqual([4096, 2731]);
    expect(canvasBackingSize(0, 0, 1, 4096)).toEqual([1, 1]);
  });
});
