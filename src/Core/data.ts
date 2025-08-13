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
