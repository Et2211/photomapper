// eslint-disable-next-line import/no-unassigned-import
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Resolve relative URLs against http://localhost so RTK Query's fetchBaseQuery
// works in Node.js (which requires absolute URLs, unlike browsers).
const _originalFetch = globalThis.fetch;
globalThis.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === "string" && input.startsWith("/")) {
    return _originalFetch(`http://localhost${input}`, init);
  }
  return _originalFetch(input, init);
};

// Mock navigator.geolocation (not available in JSDOM)
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
  watchPosition: vi.fn(),
  clearWatch: vi.fn(),
};
Object.defineProperty(globalThis.navigator, "geolocation", {
  value: mockGeolocation,
  configurable: true,
});

// Disable HTML5 constraint validation (type="email" etc.) so React Hook Form / Zod validation runs in tests
HTMLFormElement.prototype.checkValidity = () => true;
HTMLFormElement.prototype.reportValidity = () => true;

// Mock HTMLCanvasElement (no WebGL/2D canvas in JSDOM)
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  drawImage: vi.fn(),
  fillRect: vi.fn(),
}) as unknown as typeof HTMLCanvasElement.prototype.getContext;

HTMLCanvasElement.prototype.toDataURL = vi
  .fn()
  .mockReturnValue("data:image/jpeg;base64,MOCKEDBASE64");
