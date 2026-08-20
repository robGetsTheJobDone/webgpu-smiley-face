# WebGPU Smiley Face Specification

## Problem
WebGPU demos are often too complex for a first experience. This project must provide a focused, friendly example that renders a recognizable smiley face directly in a modern browser.

## Target user
Learners, frontend developers, and graphics enthusiasts who want a small, readable WebGPU example they can run and modify locally.

## Required features
- A static browser application that renders a yellow circular face on a canvas using WebGPU.
- Two visible eyes and a curved smile with crisp, responsive geometry.
- Canvas resizing that respects viewport size and device pixel ratio.
- A useful compatibility message when WebGPU is unavailable.
- No server runtime required for the shipped application.
- A reproducible Dev Container and deterministic setup, lint, test, and build commands.
- A public deployment URL and repository-backed proof of work.

## Acceptance criteria
- The smiley renders correctly in a WebGPU-capable browser.
- The layout remains centered and undistorted across common viewport sizes.
- Unsupported browsers receive an accessible, actionable message.
- Lint, typecheck, tests, and production build pass in the canonical container.
- The deployed URL serves the same tested artifact.