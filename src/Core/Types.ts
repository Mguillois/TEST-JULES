// Data model (TypeScript)

export type Vec2 = [number, number];
export type Vec3 = [number, number, number];
export type Team = 'Player' | 'Enemy';

// IDs
export type WeaponSpecId = string;
export type SoldierClassId = 'rifleman' | 'medic' | 'engineer' | 'sapper';
export type TechId = string;

export interface WeaponSpec {
    id: WeaponSpecId;
    name: string;
    roundsPerMinute: number;
    muzzleSpeed: number; // m/s
    damage: number;
    dispersionSigma: number; // radians
    tracerRatio: number; // e.g., 4 means 1 in 4 shots is a tracer
}

export interface Soldier {
    id: string;
    team: Team;
    pos: Vec2;
    hp: number;
    armor: number;
    weapon: WeaponSpecId;
    classId: SoldierClassId;
    fireCooldown: number;
    actionCooldown: number;
    aimSpread: number;
    suppressed: number;
    xp: number;
    moveTarget: Vec2 | null;
}

export interface Enemy extends Omit<Soldier, 'team' | 'actionCooldown'> {
    pathId: string;
    state: 'Advance' | 'Pause' | 'Fire' | 'Retreat' | 'Attacking';
    waypointIndex: number;
    pauseTimer: number;
}

export interface Projectile {
    id: string;
    fromId: string;
    origin: Vec3;
    pos: Vec3;
    vel: Vec3;
    life: number;
    damage: number;
    tracer: boolean;
    explosion?: {
        radius: number;
        damage: number;
    };
}

export interface Buildable {
    id: string;
    kind: 'Trench' | 'BarbedWire' | 'MGNest' | 'Bunker' | 'SniperNest' | 'Shelter' | 'Depot' | 'Workshop' | 'Barracks' | 'MortarPit';
    cells: Vec2[];
    hp: number;
    level: 1 | 2 | 3;
}

export interface Economy {
    ammo: number;
    materials: number;
    manpower: number;
}

export interface WaveSpec {
    index: number;
    spawnCount: number;
    cadence: number;
    composition: Array<{ type: 'rifle' | 'assault' | 'grenadier' | 'sapper'; weight: number }>;
    pathVariantWeights: number[];
}

export interface Tech {
    id: TechId;
    name: string;
    description: string;
    cost: { materials: number };
    dependencies: TechId[];
}
