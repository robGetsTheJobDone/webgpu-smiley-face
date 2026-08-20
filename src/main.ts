import "./style.css";
import { createSmileyRenderer } from "./renderer.js";
import { detectWebGpu, initializationMessage } from "./support.js";

export interface AppElements {
  readonly canvas: HTMLCanvasElement;
  readonly status: HTMLElement;
  readonly compatibility: HTMLElement;
}

function requiredElement<Element extends HTMLElement>(id: string, constructor: { new (): Element }): Element {
  const element = document.getElementById(id);
  if (!(element instanceof constructor)) throw new Error(`Missing required element #${id}`);
  return element;
}

export function appElements(): AppElements {
  return {
    canvas: requiredElement("smiley", HTMLCanvasElement),
    status: requiredElement("status", HTMLElement),
    compatibility: requiredElement("compatibility", HTMLElement),
  };
}

export async function startApp(elements = appElements()): Promise<void> {
  const support = detectWebGpu(navigator);
  if (!support.supported) {
    elements.canvas.hidden = true;
    elements.status.hidden = true;
    elements.compatibility.hidden = false;
    document.documentElement.dataset.renderer = "unsupported";
    return;
  }
  try {
    await createSmileyRenderer(elements.canvas, support.gpu);
    elements.status.hidden = true;
    document.documentElement.dataset.renderer = "ready";
  } catch (error) {
    elements.canvas.hidden = true;
    elements.status.hidden = true;
    elements.compatibility.hidden = false;
    const message = elements.compatibility.querySelector("p");
    if (message !== null) message.textContent = initializationMessage(error);
    document.documentElement.dataset.renderer = "failed";
  }
}

if (!import.meta.env.VITEST) void startApp();
