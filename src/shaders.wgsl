struct Viewport {
  scale: vec2f,
};

@group(0) @binding(0) var<uniform> viewport: Viewport;

struct VertexInput {
  @location(0) position: vec2f,
  @location(1) color: vec3f,
};

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) color: vec3f,
};

@vertex
fn vertexMain(input: VertexInput) -> VertexOutput {
  var output: VertexOutput;
  output.position = vec4f(input.position * viewport.scale, 0.0, 1.0);
  output.color = input.color;
  return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
  return vec4f(input.color, 1.0);
}
