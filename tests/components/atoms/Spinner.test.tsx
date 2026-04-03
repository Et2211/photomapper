import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Spinner from "@/components/atoms/Spinner";

describe("Spinner", () => {
  it("renders an svg with animate-spin", () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("animate-spin");
  });

  it("applies md size by default", () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector("svg")).toHaveClass("w-5", "h-5");
  });

  it("applies sm size classes", () => {
    const { container } = render(<Spinner size="sm" />);
    expect(container.querySelector("svg")).toHaveClass("w-4", "h-4");
  });

  it("applies lg size classes", () => {
    const { container } = render(<Spinner size="lg" />);
    expect(container.querySelector("svg")).toHaveClass("w-8", "h-8");
  });
});
