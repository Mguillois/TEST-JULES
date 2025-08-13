// Data model (TypeScript)

export type Vec2 = [number, number];
export type Team = 'Player' | 'Enemy';

// These are placeholders for IDs, allowing for more type-safe code.
// For example, instead of just `string`, we have `WeaponSpecId`.
type WeaponSpecId = string;
type SoldierClassId = string;

export interface Soldier {
  id: string;
  team: Team;
  pos: Vec2;             // metres
  hp: number;            // hit points
  armor: number;         // 0..1 damage reduction
  weapon: WeaponSpecId;
  classId: SoldierClassId;
  fireCooldown: number;  // seconds remaining
  aimSpread: number;     // radians 1-sigma
  suppressed: number;    // 0..1
  xp: number;            // experience points
}

export interface Enemy extends Omit<Soldier, 'team'> {
  pathId: string;
  state: 'Advance' | 'Pause' | 'Fire' | 'Retreat';
}

export interface Projectile {
  id: string;
  fromId: string;
  origin: Vec2;
  vel: Vec2;             // m s^-1
  life: number;          // seconds remaining
  damage: number;
  tracer: boolean;
}

export interface Buildable {
  id: string;
  kind: 'Trench' | 'BarbedWire' | 'MGNest' | 'Bunker' | 'SniperNest' | 'Shelter';
  cells: Vec2[];         // grid cells occupied
  hp: number;
  level: 1 | 2 | 3;
}

export interface Economy {
  ammo: number;
  materials: number;
  manpower: number;
  incomePerMinute: { ammo: number; materials: number; manpower: number };
}

export interface WaveSpec {
  index: number;
  spawnCount: number;
  cadence: number;      // enemies per second
  composition: Array<{ type: 'rifle'|'assault'|'grenadier'; weight: number }>;
  pathVariantWeights: number[]; // lanes 0..N-1
}
