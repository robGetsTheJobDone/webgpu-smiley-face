import { afterEach, describe, expect, it, vi } from "vitest";
import { startApp, type AppElements } from "../src/main.js";

interface VisibilityState {
  hidden: boolean;
}

function elements(): AppElements & {
  readonly canvas: HTMLCanvasElement & VisibilityState;
  readonly status: HTMLElement & VisibilityState;
  readonly compatibility: HTMLElement & VisibilityState;
} {
  return {
    canvas: { hidden: false } as HTMLCanvasElement & VisibilityState,
    status: { hidden: false } as HTMLElement & VisibilityState,
    compatibility: { hidden: true } as HTMLElement & VisibilityState,
  };
}

describe("browser smoke", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("shows an accessible compatibility state when WebGPU is unavailable", async () => {
    const dataset: DOMStringMap = {};
    vi.stubGlobal("navigator", {});
    vi.stubGlobal("document", { documentElement: { dataset } });
    const view = elements();
    await startApp(view);
    expect(view.canvas.hidden).toBe(true);
    expect(view.status.hidden).toBe(true);
    expect(view.compatibility.hidden).toBe(false);
    expect(dataset.renderer).toBe("unsupported");
  });
});
