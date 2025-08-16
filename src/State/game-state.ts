import { createStore } from 'zustand/vanilla';
import type { Soldier, Enemy, Buildable, Projectile } from '../Core/Types';
import type { Explosion } from '../Systems/ProjectileSystem';
import type { Vec2, Vec3 } from '../Core/Types';

interface GameState {
  time: number;
  soldiers: Soldier[];
  buildings: Buildable[];
  enemies: Enemy[];
  projectiles: Projectile[];
  muzzleFlashes: Vec2[];
  impactPuffs: Vec3[];
  explosions: Explosion[];
  ammo: number;
  materials: number;
  manpower: number;
}

const initialSoldiers: Soldier[] = [
  { id: 'p1', team: 'Player', pos: [-20, 0], hp: 100, armor: 0.1, weapon: 'rifle', classId: 'rifleman', fireCooldown: 0, actionCooldown: 0, aimSpread: 0.1, suppressed: 0, xp: 0, moveTarget: null },
  { id: 'p2', team: 'Player', pos: [-10, 0], hp: 100, armor: 0.1, weapon: 'rifle', classId: 'rifleman', fireCooldown: 0, actionCooldown: 0, aimSpread: 0.1, suppressed: 0, xp: 0, moveTarget: null },
  { id: 'p3', team: 'Player', pos: [0, 0], hp: 100, armor: 0.1, weapon: 'rifle', classId: 'rifleman', fireCooldown: 0, actionCooldown: 0, aimSpread: 0.1, suppressed: 0, xp: 0, moveTarget: null },
  { id: 'p4', team: 'Player', pos: [10, 0], hp: 100, armor: 0.1, weapon: 'rifle', classId: 'rifleman', fireCooldown: 0, actionCooldown: 0, aimSpread: 0.1, suppressed: 0, xp: 0, moveTarget: null },
  { id: 'p5', team: 'Player', pos: [20, 0], hp: 100, armor: 0.1, weapon: 'rifle', classId: 'rifleman', fireCooldown: 0, actionCooldown: 0, aimSpread: 0.1, suppressed: 0, xp: 0, moveTarget: null },
];


export const gameState = createStore<GameState>(() => ({
  time: 0,
  soldiers: initialSoldiers,
  buildings: [],
  enemies: [],
  projectiles: [],
  muzzleFlashes: [],
  impactPuffs: [],
  explosions: [],
  ammo: 2000,
  materials: 1000,
  manpower: 50,
}));
