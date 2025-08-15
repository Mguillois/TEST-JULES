import type { Projectile, Vec2, Vec3, Enemy } from '../Core/Types';
import { soundSystem } from './SoundSystem';

export interface Hit {
  enemyId: string;
  damage: number;
}

export interface Explosion {
    position: Vec3;
    radius: number;
    damage: number;
}

const GRAVITY = 9.81;
const distSq = (a: Vec3, b: Vec2) => (a[0] - b[0])**2 + (a[2] - b[1])**2;
const ENEMY_RADIUS_SQ = 0.5 * 0.5;

class ProjectileSystem {
  public update(dt: number, projectiles: Projectile[], enemies: Enemy[]): { updatedProjectiles: Projectile[], hits: Hit[], impacts: Vec3[], explosions: Explosion[] } {
    const stillAliveProjectiles: Projectile[] = [];
    const hits: Hit[] = [];
    const impacts: Vec3[] = [];
    const explosions: Explosion[] = [];

    if (projectiles.length === 0) {
      return { updatedProjectiles: [], hits: [], impacts: [], explosions: [] };
    }

    for (const p of projectiles) {
      const newVel: Vec3 = [p.vel[0], p.vel[1] - GRAVITY * dt, p.vel[2]];
      const newPos: Vec3 = [p.pos[0] + newVel[0] * dt, p.pos[1] + newVel[1] * dt, p.pos[2] + newVel[2] * dt];
      const newLife = p.life - dt;

      if (newLife <= 0 || newPos[1] <= 0) {
        const impactPos: Vec3 = [newPos[0], 0, newPos[2]];
        impacts.push(impactPos);
        if (p.explosion) {
            explosions.push({ position: impactPos, ...p.explosion });
        }
        soundSystem.playSound('impact_dirt');
        continue;
      }

      let hitEnemy = false;
      if (enemies.length > 0 && !p.explosion) { // AOE projectiles don't hit single targets
        for (const enemy of enemies) {
          if (newPos[1] < 1.5 && distSq(newPos, enemy.pos) < ENEMY_RADIUS_SQ) {
            hits.push({ enemyId: enemy.id, damage: p.damage });
            hitEnemy = true;
            break;
          }
        }
      }

      if (!hitEnemy) {
        stillAliveProjectiles.push({ ...p, pos: newPos, vel: newVel, life: newLife });
      }
    }

    return { updatedProjectiles: stillAliveProjectiles, hits, impacts, explosions };
  }
}

export const projectileSystem = new ProjectileSystem();
