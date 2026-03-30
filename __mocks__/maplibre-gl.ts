import { vi } from "vitest";

const MapMock = vi.fn().mockImplementation(() => ({
  on: vi.fn(),
  off: vi.fn(),
  remove: vi.fn(),
  addLayer: vi.fn(),
  removeLayer: vi.fn(),
  getCanvas: vi.fn().mockReturnValue({ style: {} }),
}));

const maplibreGl = {
  Map: MapMock,
  Marker: vi.fn(),
  Popup: vi.fn(),
  LngLat: vi.fn(),
  supported: vi.fn(() => false),
};

export default maplibreGl;
