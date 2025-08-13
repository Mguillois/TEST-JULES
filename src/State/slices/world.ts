import { StateCreator } from 'zustand';
import { Vec2 } from '../../Core/Types';

export interface WorldSlice {
  /**
   * The dimensions of the playfield in meters.
   * Format: [width, depth]
   */
  dimensions: Vec2;
}

export const createWorldSlice: StateCreator<WorldSlice, [], [], WorldSlice> = () => ({
  dimensions: [120, 80],
});
