import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import NavTab from "@/components/molecules/NavTab";

describe("NavTab", () => {
  it("renders label text", () => {
    render(<NavTab label="Map" active={false} onClick={vi.fn()}>🗺</NavTab>);
    expect(screen.getByRole("button")).toHaveTextContent("Map");
  });

  it("renders children", () => {
    render(<NavTab label="Map" active={false} onClick={vi.fn()}><span data-testid="icon" /></NavTab>);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("applies active color class when active is true", () => {
    render(<NavTab label="Map" active={true} onClick={vi.fn()}>icon</NavTab>);
    expect(screen.getByRole("button")).toHaveClass("text-blue-400");
  });

  it("applies inactive color class when active is false", () => {
    render(<NavTab label="Map" active={false} onClick={vi.fn()}>icon</NavTab>);
    expect(screen.getByRole("button")).toHaveClass("text-gray-400");
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<NavTab label="Map" active={false} onClick={onClick}>icon</NavTab>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
