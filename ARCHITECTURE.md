# WebGPU Smiley Face Architecture

## Stack
Use Vite, strict TypeScript, WGSL shaders, Vitest, ESLint, and a static deployment target. The project ships with a digest-pinnable Dev Container so humans and agents use the same toolchain.

## Modules
- `main.ts` owns page startup, status transitions, resize wiring, and error presentation.
- `renderer.ts` requests the GPU adapter/device, configures the canvas context, creates pipelines, and renders frames.
- `geometry.ts` produces normalized face, eye, and smile geometry independent of viewport dimensions.
- `shaders.wgsl` contains minimal vertex and fragment programs with explicit bind/pipeline layouts.
- `support.ts` detects WebGPU and converts initialization failures into user-facing states.

## Runtime flow
The application detects support, initializes one renderer, sizes the backing canvas using CSS dimensions and device pixel ratio, uploads immutable geometry, and redraws only on initialization or resize. No backend is required.

## Quality and delivery
Unit tests cover geometry, sizing, and support-state behavior. A browser smoke test verifies canvas or fallback visibility. CI runs install, lint, typecheck, test, and build inside the canonical environment. The generated static assets are deployed behind HTTPS, which WebGPU requires outside localhost.

## Repository contract
The repository contains `.devcontainer/`, `.harness/project.yaml`, SPEC.md, DESIGN.md, ARCHITECTURE.md, ROADMAP.md, source, tests, and deployment configuration.