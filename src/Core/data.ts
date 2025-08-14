import { WeaponSpec, WeaponSpecId } from './Types';

export const WEAPON_DATA: Record<WeaponSpecId, WeaponSpec> = {
  rifle: {
    id: 'rifle',
    name: 'Standard Rifle',
    roundsPerMinute: 40, // A more realistic sustained fire rate
    muzzleSpeed: 760,    // m/s
    damage: 10,
    dispersionSigma: 0.015, // radians, ~0.85 degrees
    tracerRatio: 5,         // 1 in 5 rounds is a tracer
  },
};

import { Tech, TechId } from './Types';

export const BUILDING_INCOME: Record<string, { ammo?: number, materials?: number, manpower?: number }> = {
    'Depot': { ammo: 10 },
    'Workshop': { materials: 5 },
    'Barracks': { manpower: 1 },
};

export const TECH_TREE: Record<TechId, Tech> = {
    'optics': {
        id: 'optics',
        name: 'Improved Optics',
        description: 'Increases the firing range of all soldiers.',
        cost: { materials: 100 },
        dependencies: [],
    },
    'steel_helmet': {
        id: 'steel_helmet',
        name: 'Steel Helmets',
        description: 'Reduces damage taken by soldiers.',
        cost: { materials: 150 },
        dependencies: ['optics'],
    },
    'trench_periscope': {
        id: 'trench_periscope',
        name: 'Trench Periscopes',
        description: 'Allows units in trenches to acquire targets faster.',
        cost: { materials: 80 },
        dependencies: ['optics'],
    },
};
