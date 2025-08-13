import { describe, it, expect } from 'vitest';
import { buildSystem } from './BuildSystem';
import { Buildable } from '../Core/Types';

describe('buildSystem', () => {
  describe('validatePlacement', () => {
    // A trench is 4x2, so its AABB is from [-2, -1] to [2, 1] if centered at [0,0]
    const existingBuildings: Buildable[] = [
      { id: 'b1', kind: 'Trench', cells: [[0, 0]], hp: 100, level: 1 },
    ];

    it('should return true for a valid, non-overlapping placement', () => {
      // This position is far away and should not overlap.
      const newPos: [number, number] = [10, 10];
      const isValid = buildSystem.validatePlacement(newPos, existingBuildings);
      expect(isValid).toBe(true);
    });

    it('should return false for a position that overlaps an existing building', () => {
      // This position is close and should overlap.
      const newPos: [number, number] = [1, 1];
      const isValid = buildSystem.validatePlacement(newPos, existingBuildings);
      expect(isValid).toBe(false);
    });

    it('should return true for a placement that is exactly adjacent (touching but not overlapping)', () => {
        // A new trench at [4, 0] should have its left edge at x=2, touching the right edge of the existing trench.
        const newPos: [number, number] = [4, 0];
        const isValid = buildSystem.validatePlacement(newPos, existingBuildings);
        expect(isValid).toBe(true);
    });

    it('should return true when there are no existing buildings', () => {
        const newPos: [number, number] = [0, 0];
        const isValid = buildSystem.validatePlacement(newPos, []);
        expect(isValid).toBe(true);
    });
  });

  describe('getCost', () => {
      it('should return the correct cost for a trench', () => {
          expect(buildSystem.getCost('trench')).toBe(10);
      });
  });
});
