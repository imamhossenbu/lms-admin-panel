import { describe, it, expect } from "vitest";
import { cn } from "../lib/cn";

describe("cn utility", () => {
  it("should merge class names correctly", () => {
    const result = cn("p-4", "text-red-500", false && "hidden");
    expect(result).toBe("p-4 text-red-500");
  });

  it("should resolve conflicting tailwind classes", () => {
    const result = cn("p-2", "p-4");
    expect(result).toBe("p-4");
  });
});
