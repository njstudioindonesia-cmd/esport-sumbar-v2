import { describe, it, expect, vi, afterEach } from "vitest";
import {
  calcConcentricRadius,
  MOTION_DURATIONS,
  MOTION_SPRINGS,
  MOTION_EASINGS,
  executeViewTransition,
} from "@/components/glass";

describe("Glass Foundation Primitives (Bagian 4)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("concentricRadius calculations", () => {
    it("should compute correct child radius given parent radius and padding", () => {
      expect(calcConcentricRadius(32, 16)).toBe(16);
      expect(calcConcentricRadius(24, 8)).toBe(16);
      expect(calcConcentricRadius(40, 20)).toBe(20);
    });

    it("should floor at 0 when padding is equal to or exceeds parent radius", () => {
      expect(calcConcentricRadius(16, 16)).toBe(0);
      expect(calcConcentricRadius(12, 20)).toBe(0);
      expect(calcConcentricRadius(0, 10)).toBe(0);
    });
  });

  describe("motion tokens and presets", () => {
    it("should define standard durations compliant with 2026 motion guidelines", () => {
      expect(MOTION_DURATIONS.instant).toBe(0.1);
      expect(MOTION_DURATIONS.fast).toBe(0.18);
      expect(MOTION_DURATIONS.base).toBe(0.28);
      expect(MOTION_DURATIONS.slow).toBe(0.45);
      expect(MOTION_DURATIONS.cinematic).toBe(0.7);
    });

    it("should define spring configurations with physical properties", () => {
      expect(MOTION_SPRINGS.snappy.stiffness).toBe(400);
      expect(MOTION_SPRINGS.snappy.damping).toBe(30);
      expect(MOTION_SPRINGS.fluid.stiffness).toBe(280);
      expect(MOTION_SPRINGS.gentle.stiffness).toBe(140);
    });

    it("should define smooth easings", () => {
      expect(MOTION_EASINGS.standardOut).toEqual([0.22, 1, 0.36, 1]);
    });
  });

  describe("executeViewTransition utility", () => {
    it("should invoke callback directly when document or window is undefined (SSR / Node)", () => {
      const cb = vi.fn();
      executeViewTransition(cb);
      expect(cb).toHaveBeenCalledTimes(1);
    });

    it("should invoke callback directly if prefers-reduced-motion is active in browser", () => {
      const cb = vi.fn();
      const mockWindow = {
        matchMedia: vi.fn().mockImplementation((query) => ({
          matches: query === "(prefers-reduced-motion: reduce)",
          media: query,
        })),
      };
      const mockDocument = {};

      vi.stubGlobal("window", mockWindow);
      vi.stubGlobal("document", mockDocument);

      executeViewTransition(cb);
      expect(cb).toHaveBeenCalledTimes(1);

      vi.unstubAllGlobals();
    });

    it("should use document.startViewTransition when available and reduced motion is false", () => {
      const cb = vi.fn();
      const startViewTransition = vi.fn().mockImplementation((fn: () => void) => {
        fn();
        return {
          finished: Promise.resolve(),
          ready: Promise.resolve(),
          updateCallbackDone: Promise.resolve(),
        };
      });

      const mockWindow = {
        matchMedia: vi.fn().mockReturnValue({ matches: false }),
      };
      const mockDocument = {
        startViewTransition,
      };

      vi.stubGlobal("window", mockWindow);
      vi.stubGlobal("document", mockDocument);

      executeViewTransition(cb);
      expect(startViewTransition).toHaveBeenCalledWith(cb);
      expect(cb).toHaveBeenCalledTimes(1);

      vi.unstubAllGlobals();
    });
  });
});
