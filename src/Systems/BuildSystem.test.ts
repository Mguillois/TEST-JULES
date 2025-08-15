import { describe, it, expect } from 'vitest';
import { buildSystem } from './BuildSystem';
import type { Buildable } from '../Core/Types';

describe('buildSystem', () => {
  describe('validatePlacement', () => {
    const existingBuildings: Buildable[] = [
      { id: 'b1', kind: 'BarbedWire', cells: [[0, 0]], hp: 100, level: 1 },
    ];

    it('should return true for a valid, non-overlapping placement', () => {
      const newPos: [number, number] = [10, 10];
      const isValid = buildSystem.validatePlacement(newPos, 'wire', existingBuildings);
      expect(isValid).toBe(true);
    });

    it('should return false for an overlapping placement', () => {
      const newPos: [number, number] = [1, 1];
      const isValid = buildSystem.validatePlacement(newPos, 'wire', existingBuildings);
      expect(isValid).toBe(false);
    });

    it('should return true for placing a trench, as it does not overlap with buildables', () => {
        const newPos: [number, number] = [1, 1];
        const isValid = buildSystem.validatePlacement(newPos, 'trench', existingBuildings);
        expect(isValid).toBe(true);
    });
  });

  describe('getCost', () => {
      it('should return the correct cost for a known item', () => {
          expect(buildSystem.getCost('wire')).toBe(10);
      });
      it('should return Infinity for an unknown item', () => {
          expect(buildSystem.getCost('unknown' as any)).toBe(Infinity);
      });
  });
});
