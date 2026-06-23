import { describe, it, expect } from "vitest";
import fc from "fast-check";

describe("Project Setup", () => {
  it("should have a working test environment", () => {
    expect(1 + 1).toBe(2);
  });

  it("should support fast-check property-based testing", () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        expect(a + b).toBe(b + a);
      }),
      { numRuns: 100 }
    );
  });
});
