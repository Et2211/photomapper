import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { timeAgo } from "@/lib/timeAgo";

describe("timeAgo", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "just now" for a date less than 60 seconds ago', () => {
    const date = new Date("2024-01-01T11:59:30Z").toISOString();
    expect(timeAgo(date)).toBe("just now");
  });

  it('returns "just now" for a date exactly 0 seconds ago', () => {
    const date = new Date("2024-01-01T12:00:00Z").toISOString();
    expect(timeAgo(date)).toBe("just now");
  });

  it("returns minutes ago for a date between 1 and 59 minutes ago", () => {
    const date = new Date("2024-01-01T11:45:00Z").toISOString();
    expect(timeAgo(date)).toBe("15m ago");
  });

  it("returns hours ago for a date between 1 and 23 hours ago", () => {
    const date = new Date("2024-01-01T09:00:00Z").toISOString();
    expect(timeAgo(date)).toBe("3h ago");
  });

  it("returns days ago for a date 24+ hours ago", () => {
    const date = new Date("2023-12-30T12:00:00Z").toISOString();
    expect(timeAgo(date)).toBe("2d ago");
  });
});
