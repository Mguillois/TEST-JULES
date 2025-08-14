import { Projectile, Vec2, Enemy } from '../Core/Types';
import { soundSystem } from './SoundSystem';

export interface Hit {
  enemyId: string;
  damage: number;
}

const distSq = (a: Vec2, b: Vec2) => (a[0] - b[0])**2 + (a[1] - b[1])**2;
const ENEMY_RADIUS_SQ = 0.5 * 0.5;

class ProjectileSystem {
  /**
   * Updates projectiles: moves them, checks for collisions, and handles lifetime.
   * @returns An object containing surviving projectiles, hits, and ground impacts.
   */
  public update(dt: number, projectiles: Projectile[], enemies: Enemy[]): { updatedProjectiles: Projectile[], hits: Hit[], impacts: Vec2[] } {
    const stillAliveProjectiles: Projectile[] = [];
    const hits: Hit[] = [];
    const impacts: Vec2[] = [];

    if (projectiles.length === 0) {
      return { updatedProjectiles: [], hits: [], impacts: [] };
    }

    for (const p of projectiles) {
      const newPos: Vec2 = [p.pos[0] + p.vel[0] * dt, p.pos[1] + p.vel[1] * dt];
      const newLife = p.life - dt;

      if (newLife <= 0) {
        impacts.push(newPos); // Projectile expired, create an impact puff
        soundSystem.playSound('impact_dirt');
        continue;
      }

      let hitEnemy = false;
      if (enemies.length > 0) {
        for (const enemy of enemies) {
          if (distSq(newPos, enemy.pos) < ENEMY_RADIUS_SQ) {
            hits.push({ enemyId: enemy.id, damage: p.damage });
            hitEnemy = true;
            break;
          }
        }
      }

      if (!hitEnemy) {
        stillAliveProjectiles.push({ ...p, pos: newPos, life: newLife });
      }
    }

    return { updatedProjectiles: stillAliveProjectiles, hits, impacts };
  }
}

export const projectileSystem = new ProjectileSystem();
