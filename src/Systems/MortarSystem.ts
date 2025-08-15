import type { Vec3, Projectile } from '../Core/Types';
import { calculateBallisticVelocity } from '../Core/Utils';
import { v4 as uuidv4 } from 'uuid';

const MORTAR_LAUNCH_ANGLE = Math.PI / 4; // 45 degrees

class MortarSystem {
    /**
     * Creates a new mortar shell projectile aimed at a target.
     * @param fromBuildingId The ID of the firing mortar pit.
     * @param origin The 3D position where the shell is fired from.
     * @param target The 3D position to aim at.
     * @returns A new Projectile object, or null if the shot is not possible.
     */
    public fire(fromBuildingId: string, origin: Vec3, target: Vec3): Projectile | null {
        const initialVelocity = calculateBallisticVelocity(origin, target, MORTAR_LAUNCH_ANGLE);

        if (!initialVelocity) {
            console.warn(`Mortar at ${origin} could not hit target ${target}: out of range.`);
            return null;
        }

        return {
            id: uuidv4(),
            fromId: fromBuildingId,
            origin: [...origin],
            pos: [...origin],
            vel: initialVelocity,
            life: 30, // Mortar shells have a long lifetime
            damage: 50, // This damage is used for the explosion
            tracer: false,
            explosion: {
                radius: 5, // 5 meter explosion radius
                damage: 50,
            },
        };
    }
}

export const mortarSystem = new MortarSystem();
