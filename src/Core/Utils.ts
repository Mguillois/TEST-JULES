/**
 * Generates a random number from a standard normal distribution (mean 0, stdDev 1).
 * Uses the Box-Muller transform.
 */
function randomStandardNormal(): number {
  let u1 = 0, u2 = 0;
  // Convert [0,1) to (0,1)
  while (u1 === 0) u1 = Math.random();
  while (u2 === 0) u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0;
}

/**
 * Generates a random number from a normal distribution with a specified mean and standard deviation.
 * @param mean The mean of the distribution.
 * @param stdDev The standard deviation of the distribution.
 * @returns A random number.
 */
import { Vec3 } from './Types';

export function randomNormal(mean: number, stdDev: number): number {
  return mean + randomStandardNormal() * stdDev;
}

const GRAVITY = 9.81;

/**
 * Calculates the initial velocity required for a projectile to hit a target.
 * Solves a ballistic trajectory equation.
 * @param origin The starting position of the projectile.
 * @param target The target position.
 * @param angle The launch angle in radians.
 * @returns The initial velocity vector (Vec3), or null if the target is out of range.
 */
export function calculateBallisticVelocity(origin: Vec3, target: Vec3, angle: number): Vec3 | null {
    const delta = [target[0] - origin[0], target[1] - origin[1], target[2] - origin[2]];
    const deltaXZ = Math.sqrt(delta[0]**2 + delta[2]**2);

    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);
    const tanAngle = Math.tan(angle);

    // Ballistic formula to find the required initial velocity (v)
    const v_sq = (GRAVITY * deltaXZ**2) / (2 * cosAngle**2 * (deltaXZ * tanAngle - delta[1]));

    if (v_sq < 0) {
        // Target is out of range for this angle
        return null;
    }

    const v = Math.sqrt(v_sq);

    const angleXZ = Math.atan2(delta[2], delta[0]);
    const velX = v * Math.cos(angleXZ) * cosAngle;
    const velY = v * sinAngle;
    const velZ = v * Math.sin(angleXZ) * cosAngle;

    return [velX, velY, velZ];
}
