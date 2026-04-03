import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import MapPin from "@/components/atoms/MapPin";

describe("MapPin", () => {
  it("renders a div element", () => {
    const { container } = render(<MapPin />);
    expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
  });

  it("has blue background and rounded-full styling", () => {
    const { container } = render(<MapPin />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("bg-blue-600", "rounded-full", "border-white");
  });
});
