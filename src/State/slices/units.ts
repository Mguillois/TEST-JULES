import { StateCreator } from 'zustand';
import { Soldier, Enemy, Projectile } from '../../Core/Types';

export interface UnitsSlice {
  soldiers: Soldier[];
  enemies: Enemy[];
  projectiles: Projectile[];
  actions: {
    // Placeholder for actions to add, remove, and update units.
    // These will be implemented as part of the game systems.
  };
}

export const createUnitsSlice: StateCreator<UnitsSlice, [], [], UnitsSlice> = () => ({
  soldiers: [],
  enemies: [],
  projectiles: [],
  actions: {},
});
