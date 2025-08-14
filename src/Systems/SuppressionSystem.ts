import { Enemy, Projectile, Vec2 } from '../Core/Types';

const SUPPRESSION_RADIUS_SQ = 2 * 2; // A 2-meter radius for a near miss
const SUPPRESSION_PER_NEAR_MISS = 0.15; // Amount of suppression gained per miss
const SUPPRESSION_DECAY_RATE = 0.2; // Suppression decays by 0.2 per second

// Helper to calculate distance squared, avoiding a square root
const distSq = (a: Vec2, b: Vec2) => (a[0] - b[0])**2 + (a[1] - b[1])**2;

class SuppressionSystem {
  /**
   * Updates the suppression level of enemies based on near misses and decay.
   * @param dt Delta time.
   * @param enemies The current array of enemies.
   * @param projectiles The array of projectiles that are still in flight (i.e., have not hit anything).
   * @returns A new array of enemies with updated suppression values.
   */
  public update(dt: number, enemies: Enemy[], projectiles: Projectile[]): Enemy[] {
    if (projectiles.length === 0 && enemies.every(e => e.suppression === 0)) {
      return enemies; // Optimization: skip if no work to do
    }

    const suppressionDeltas = new Map<string, number>();

    // Increase suppression from near misses
    if (projectiles.length > 0) {
      for (const enemy of enemies) {
        for (const p of projectiles) {
          // Check if the projectile passed close to the enemy
          if (distSq(enemy.pos, p.pos) < SUPPRESSION_RADIUS_SQ) {
            suppressionDeltas.set(enemy.id, (suppressionDeltas.get(enemy.id) || 0) + SUPPRESSION_PER_NEAR_MISS);
          }
        }
      }
    }

    // Apply suppression changes and natural decay
    return enemies.map(enemy => {
      const suppressionGained = suppressionDeltas.get(enemy.id) || 0;
      const decay = SUPPRESSION_DECAY_RATE * dt;

      const newSuppression = Math.max(0, Math.min(1, enemy.suppression + suppressionGained - decay));

      // Avoid tiny floating point values when suppression is effectively zero
      if (newSuppression < 0.01) {
        return { ...enemy, suppression: 0 };
      }

      return { ...enemy, suppression: newSuppression };
    });
  }
}

export const suppressionSystem = new SuppressionSystem();
