import { Projectile, Vec2, Enemy } from '../Core/Types';

export interface Hit {
  enemyId: string;
  damage: number;
}

// Helper to calculate distance squared
const distSq = (a: Vec2, b: Vec2) => (a[0] - b[0])**2 + (a[1] - b[1])**2;
const ENEMY_RADIUS = 0.5; // meters
const ENEMY_RADIUS_SQ = ENEMY_RADIUS * ENEMY_RADIUS;

class ProjectileSystem {
  /**
   * Updates projectiles: moves them, checks for collisions, and handles lifetime.
   * @returns An object containing the list of surviving projectiles and a list of hits that occurred.
   */
  public update(dt: number, projectiles: Projectile[], enemies: Enemy[]): { updatedProjectiles: Projectile[], hits: Hit[] } {
    const stillAliveProjectiles: Projectile[] = [];
    const hits: Hit[] = [];

    if (projectiles.length === 0) {
      return { updatedProjectiles: [], hits: [] };
    }

    for (const p of projectiles) {
      const newPos: Vec2 = [p.pos[0] + p.vel[0] * dt, p.pos[1] + p.vel[1] * dt];
      const newLife = p.life - dt;

      if (newLife <= 0) continue; // Projectile expired

      let hitEnemy = false;
      // Only check for collisions if there are enemies
      if (enemies.length > 0) {
        for (const enemy of enemies) {
          if (distSq(newPos, enemy.pos) < ENEMY_RADIUS_SQ) {
            hits.push({ enemyId: enemy.id, damage: p.damage });
            hitEnemy = true;
            break; // Projectile hits one enemy and is consumed
          }
        }
      }

      if (!hitEnemy) {
        stillAliveProjectiles.push({ ...p, pos: newPos, life: newLife });
      }
    }

    return { updatedProjectiles: stillAliveProjectiles, hits };
  }
}

export const projectileSystem = new ProjectileSystem();
