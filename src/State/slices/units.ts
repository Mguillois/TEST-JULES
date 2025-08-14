import { StateCreator } from 'zustand';
import { Soldier, Enemy, Projectile, Vec2 } from '../../Core/Types';

export interface UnitsSlice {
  soldiers: Soldier[];
  enemies: Enemy[];
  projectiles: Projectile[];
  muzzleFlashes: Vec2[]; // Positions of flashes this frame
  impactPuffs: Vec2[]; // Positions of ground impacts this frame
  actions: {
    // Placeholder for actions to add, remove, and update units.
    // These will be implemented as part of the game systems.
  };
}

const initialSoldiers: Soldier[] = [
  { id: 'p1', team: 'Player', pos: [-20, 0], hp: 100, armor: 0.1, weapon: 'rifle', classId: 'rifleman', fireCooldown: 0, aimSpread: 0.1, suppressed: 0, xp: 0 },
  { id: 'p2', team: 'Player', pos: [-10, 0], hp: 100, armor: 0.1, weapon: 'rifle', classId: 'rifleman', fireCooldown: 0, aimSpread: 0.1, suppressed: 0, xp: 0 },
  { id: 'p3', team: 'Player', pos: [0, 0], hp: 100, armor: 0.1, weapon: 'rifle', classId: 'rifleman', fireCooldown: 0, aimSpread: 0.1, suppressed: 0, xp: 0 },
  { id: 'p4', team: 'Player', pos: [10, 0], hp: 100, armor: 0.1, weapon: 'rifle', classId: 'rifleman', fireCooldown: 0, aimSpread: 0.1, suppressed: 0, xp: 0 },
  { id: 'p5', team: 'Player', pos: [20, 0], hp: 100, armor: 0.1, weapon: 'rifle', classId: 'rifleman', fireCooldown: 0, aimSpread: 0.1, suppressed: 0, xp: 0 },
];

export const createUnitsSlice: StateCreator<UnitsSlice, [], [], UnitsSlice> = () => ({
  soldiers: initialSoldiers,
  enemies: [],
  projectiles: [],
  muzzleFlashes: [],
  impactPuffs: [],
  actions: {},
});
