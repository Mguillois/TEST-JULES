import type { Enemy, Projectile, Vec2, Vec3 } from '../Core/Types';

const SUPPRESSION_RADIUS_SQ = 2 * 2;
const SUPPRESSION_PER_NEAR_MISS = 0.15;
const SUPPRESSION_DECAY_RATE = 0.2;

const distSq = (a: Vec3, b: Vec2) => (a[0] - b[0])**2 + (a[1] - 0.5)**2 + (a[2] - b[1])**2;

class SuppressionSystem {
  public update(dt: number, enemies: Enemy[], projectiles: Projectile[]): Enemy[] {
    if (projectiles.length === 0 && enemies.every(e => e.suppressed === 0)) {
      return enemies;
    }

    const suppressionDeltas = new Map<string, number>();

    if (projectiles.length > 0) {
      for (const enemy of enemies) {
        for (const p of projectiles) {
          if (distSq(p.pos, enemy.pos) < SUPPRESSION_RADIUS_SQ) {
            suppressionDeltas.set(enemy.id, (suppressionDeltas.get(enemy.id) || 0) + SUPPRESSION_PER_NEAR_MISS);
          }
        }
      }
    }

    return enemies.map(enemy => {
      const suppressionGained = suppressionDeltas.get(enemy.id) || 0;
      const decay = SUPPRESSION_DECAY_RATE * dt;
      const newSuppression = Math.max(0, Math.min(1, enemy.suppressed + suppressionGained - decay));

      if (newSuppression < 0.01) {
        return { ...enemy, suppressed: 0 };
      }
      return { ...enemy, suppressed: newSuppression };
    });
  }
}

export const suppressionSystem = new SuppressionSystem();
