import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import ModalShell from "@/components/molecules/ModalShell";

describe("ModalShell", () => {
  it("renders the title", () => {
    render(<ModalShell title="My Modal" onClose={vi.fn()}>content</ModalShell>);
    expect(screen.getByRole("heading", { name: "My Modal" })).toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <ModalShell title="Modal" onClose={vi.fn()}>
        <p>Modal content</p>
      </ModalShell>,
    );
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("calls onClose when the × button is clicked", async () => {
    const onClose = vi.fn();
    render(<ModalShell title="Modal" onClose={onClose}>content</ModalShell>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("applies max-w-sm when maxWidth is sm (default)", () => {
    render(<ModalShell title="Modal" onClose={vi.fn()}>content</ModalShell>);
    const container = screen.getByRole("heading").closest("div");
    expect(container?.parentElement).toHaveClass("max-w-sm");
  });

  it("applies max-w-lg when maxWidth is lg", () => {
    render(<ModalShell title="Modal" onClose={vi.fn()} maxWidth="lg">content</ModalShell>);
    const container = screen.getByRole("heading").closest("div");
    expect(container?.parentElement).toHaveClass("max-w-lg");
  });

  it("applies overflow-y-auto when scrollable is true", () => {
    render(<ModalShell title="Modal" onClose={vi.fn()} scrollable>content</ModalShell>);
    const container = screen.getByRole("heading").closest("div");
    expect(container?.parentElement).toHaveClass("overflow-y-auto");
  });

  it("does not apply overflow-y-auto when scrollable is false (default)", () => {
    render(<ModalShell title="Modal" onClose={vi.fn()}>content</ModalShell>);
    const container = screen.getByRole("heading").closest("div");
    expect(container?.parentElement).not.toHaveClass("overflow-y-auto");
  });
});
