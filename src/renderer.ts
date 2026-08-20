import shaderSource from "./shaders.wgsl?raw";
import { canvasBackingSize, createSmileyGeometry } from "./geometry.js";

export interface SmileyRenderer {
  readonly draw: () => void;
  readonly resize: () => void;
  readonly destroy: () => void;
}

export async function createSmileyRenderer(canvas: HTMLCanvasElement, gpu: GPU): Promise<SmileyRenderer> {
  const adapter = await gpu.requestAdapter({ powerPreference: "high-performance" });
  if (adapter === null) throw new Error("No compatible WebGPU adapter was found.");
  const device = await adapter.requestDevice();
  const context = canvas.getContext("webgpu");
  if (context === null) throw new Error("The canvas could not create a WebGPU context.");
  const format = gpu.getPreferredCanvasFormat();
  const geometry = createSmileyGeometry();
  const vertexBuffer = device.createBuffer({
    label: "smiley vertices",
    size: geometry.vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(vertexBuffer, 0, geometry.vertices);
  const viewportBuffer = device.createBuffer({
    label: "viewport scale",
    size: 8,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  const shader = device.createShaderModule({ label: "smiley shader", code: shaderSource });
  const bindGroupLayout = device.createBindGroupLayout({
    entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: "uniform" } }],
  });
  const pipeline = device.createRenderPipeline({
    label: "smiley pipeline",
    layout: device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] }),
    vertex: {
      module: shader,
      entryPoint: "vertexMain",
      buffers: [{
        arrayStride: 20,
        attributes: [
          { shaderLocation: 0, offset: 0, format: "float32x2" },
          { shaderLocation: 1, offset: 8, format: "float32x3" },
        ],
      }],
    },
    fragment: { module: shader, entryPoint: "fragmentMain", targets: [{ format }] },
    primitive: { topology: "triangle-list" },
  });
  const bindGroup = device.createBindGroup({
    layout: bindGroupLayout,
    entries: [{ binding: 0, resource: { buffer: viewportBuffer } }],
  });

  const draw = (): void => {
    const encoder = device.createCommandEncoder({ label: "smiley frame" });
    const pass = encoder.beginRenderPass({
      colorAttachments: [{
        view: context.getCurrentTexture().createView(),
        clearValue: { r: 1, g: 0.97, b: 0.89, a: 1 },
        loadOp: "clear",
        storeOp: "store",
      }],
    });
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.setVertexBuffer(0, vertexBuffer);
    pass.draw(geometry.vertexCount);
    pass.end();
    device.queue.submit([encoder.finish()]);
  };

  const resize = (): void => {
    const bounds = canvas.getBoundingClientRect();
    const [width, height] = canvasBackingSize(bounds.width, bounds.height, window.devicePixelRatio, device.limits.maxTextureDimension2D);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      context.configure({ device, format, alphaMode: "opaque" });
    }
    const aspect = width / height;
    device.queue.writeBuffer(viewportBuffer, 0, new Float32Array(aspect > 1 ? [1 / aspect, 1] : [1, aspect]));
    draw();
  };

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  device.lost.then(() => { observer.disconnect(); }).catch(() => { observer.disconnect(); });
  resize();
  return { draw, resize, destroy: () => { observer.disconnect(); vertexBuffer.destroy(); viewportBuffer.destroy(); device.destroy(); } };
}
