import { StateCreator } from 'zustand';
import { Soldier, Enemy, Projectile, Vec2, Vec3 } from '../../Core/Types';
import { Explosion } from '../../Systems/ProjectileSystem';

export interface UnitsSlice {
  soldiers: Soldier[];
  selectedSoldierId: string | null;
  enemies: Enemy[];
  projectiles: Projectile[];
  muzzleFlashes: Vec2[]; // Positions of flashes this frame
  impactPuffs: Vec3[]; // Positions of ground impacts this frame
  explosions: Explosion[]; // Explosions happening this frame
  actions: {
    addSoldier: (soldier: Soldier) => void;
    addProjectile: (projectile: Projectile) => void;
    selectSoldier: (soldierId: string | null) => void;
    setSoldierMoveTarget: (soldierId: string, target: Vec2) => void;
  };
}

const initialSoldiers: Soldier[] = [
  { id: 'p1', team: 'Player', pos: [-20, 0], hp: 100, armor: 0.1, weapon: 'rifle', classId: 'rifleman', fireCooldown: 0, actionCooldown: 0, aimSpread: 0.1, suppressed: 0, xp: 0, moveTarget: null },
  { id: 'p2', team: 'Player', pos: [-10, 0], hp: 100, armor: 0.1, weapon: 'rifle', classId: 'rifleman', fireCooldown: 0, actionCooldown: 0, aimSpread: 0.1, suppressed: 0, xp: 0, moveTarget: null },
  { id: 'p3', team: 'Player', pos: [0, 0], hp: 100, armor: 0.1, weapon: 'rifle', classId: 'rifleman', fireCooldown: 0, actionCooldown: 0, aimSpread: 0.1, suppressed: 0, xp: 0, moveTarget: null },
  { id: 'p4', team: 'Player', pos: [10, 0], hp: 100, armor: 0.1, weapon: 'rifle', classId: 'rifleman', fireCooldown: 0, actionCooldown: 0, aimSpread: 0.1, suppressed: 0, xp: 0, moveTarget: null },
  { id: 'p5', team: 'Player', pos: [20, 0], hp: 100, armor: 0.1, weapon: 'rifle', classId: 'rifleman', fireCooldown: 0, actionCooldown: 0, aimSpread: 0.1, suppressed: 0, xp: 0, moveTarget: null },
];

export const createUnitsSlice: StateCreator<UnitsSlice, [], [], UnitsSlice> = (set) => ({
  soldiers: initialSoldiers,
  selectedSoldierId: null,
  enemies: [],
  projectiles: [],
  muzzleFlashes: [],
  impactPuffs: [],
  explosions: [],
  actions: {
    addSoldier: (soldier) => set((state) => ({ soldiers: [...state.soldiers, soldier] })),
    addProjectile: (projectile) => set((state) => ({ projectiles: [...state.projectiles, projectile] })),
    selectSoldier: (soldierId) => set({ selectedSoldierId: soldierId }),
    setSoldierMoveTarget: (soldierId, target) => set((state) => ({
        soldiers: state.soldiers.map(s => s.id === soldierId ? { ...s, moveTarget: target } : s),
    })),
  },
});
