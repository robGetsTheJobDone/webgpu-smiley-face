import { describe, expect, it } from "vitest";
import { detectWebGpu, initializationMessage } from "../src/support.js";

describe("WebGPU support", () => {
  it("distinguishes available and unavailable browser APIs", () => {
    expect(detectWebGpu({})).toEqual({ supported: false, reason: "missing_api" });
    const gpu = {} as GPU;
    expect(detectWebGpu({ gpu })).toEqual({ supported: true, gpu });
  });

  it("turns failures into useful messages", () => {
    expect(initializationMessage(new Error("Adapter unavailable"))).toBe("Adapter unavailable");
    expect(initializationMessage(null)).toBe("WebGPU could not start on this device.");
  });
});
