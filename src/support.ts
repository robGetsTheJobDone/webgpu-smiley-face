export type WebGpuSupport =
  | { readonly supported: true; readonly gpu: GPU }
  | { readonly supported: false; readonly reason: "missing_api" };

export function detectWebGpu(navigatorLike: Pick<Navigator, "gpu"> | Record<string, unknown>): WebGpuSupport {
  const gpu = "gpu" in navigatorLike ? navigatorLike.gpu : undefined;
  return gpu === undefined ? { supported: false, reason: "missing_api" } : { supported: true, gpu: gpu as GPU };
}

export function initializationMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) return error.message;
  return "WebGPU could not start on this device.";
}
