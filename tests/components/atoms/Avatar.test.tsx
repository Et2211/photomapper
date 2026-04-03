import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Avatar from "@/components/atoms/Avatar";

describe("Avatar", () => {
  it("renders an image with the given src and alt", () => {
    render(<Avatar src="https://example.com/photo.jpg" alt="Jane Doe" />);
    const img = screen.getByRole("img", { name: "Jane Doe" });
    expect(img).toHaveAttribute("src", "https://example.com/photo.jpg");
  });

  it("applies md size classes by default", () => {
    render(<Avatar src="x" alt="test" />);
    expect(screen.getByRole("img")).toHaveClass("w-16", "h-16");
  });

  it("applies sm size classes", () => {
    render(<Avatar src="x" alt="test" size="sm" />);
    expect(screen.getByRole("img")).toHaveClass("w-10", "h-10");
  });

  it("applies rounded-lg by default (circle=false)", () => {
    render(<Avatar src="x" alt="test" />);
    expect(screen.getByRole("img")).toHaveClass("rounded-lg");
  });

  it("applies rounded-full when circle=true", () => {
    render(<Avatar src="x" alt="test" circle />);
    expect(screen.getByRole("img")).toHaveClass("rounded-full");
  });

  it("is not draggable", () => {
    render(<Avatar src="x" alt="test" />);
    expect(screen.getByRole("img")).toHaveAttribute("draggable", "false");
  });
});
