import { Soldier, Enemy, Projectile, Vec2 } from '../Core/Types';
import { WEAPON_DATA } from '../Core/data';
import { randomNormal } from '../Core/Utils';
import { v4 as uuidv4 } from 'uuid';

// Helper to calculate distance squared
const distSq = (a: Vec2, b: Vec2) => (a[0] - b[0])**2 + (a[1] - b[1])**2;

class WeaponSystem {
  public update(
    dt: number,
    soldiers: Soldier[],
    enemies: Enemy[],
    currentAmmo: number
  ): { newProjectiles: Projectile[]; updatedSoldiers: Soldier[]; muzzleFlashPositions: Vec2[]; ammoSpent: number } {
    const newProjectiles: Projectile[] = [];
    const muzzleFlashPositions: Vec2[] = [];
    let ammoSpent = 0;

    const updatedSoldiers = soldiers.map(soldier => {
      const newCooldown = soldier.fireCooldown - dt;

      // Check if ready to fire and if there is ammo
      if (newCooldown <= 0 && enemies.length > 0 && (currentAmmo - ammoSpent) > 0) {
        const target = this.findClosestEnemy(soldier, enemies);

        if (target) {
          const weaponSpec = WEAPON_DATA[soldier.weapon];
          if (!weaponSpec) return { ...soldier, fireCooldown: 0 };

          const fireInterval = 60 / weaponSpec.roundsPerMinute;

          const projectile = this.createProjectile(soldier, target);
          newProjectiles.push(projectile);
          muzzleFlashPositions.push(soldier.pos);
          ammoSpent += 1; // Each shot costs 1 ammo

          return { ...soldier, fireCooldown: fireInterval };
        }
      }

      return { ...soldier, fireCooldown: newCooldown > 0 ? newCooldown : 0 };
    });

    return { newProjectiles, updatedSoldiers, muzzleFlashPositions, ammoSpent };
  }

  private findClosestEnemy(soldier: Soldier, enemies: Enemy[]): Enemy | null {
    let closestEnemy: Enemy | null = null;
    let minDistanceSq = 35 * 35; // Max range of 35m

    for (const enemy of enemies) {
      const distanceSq = distSq(soldier.pos, enemy.pos);
      if (distanceSq < minDistanceSq) {
        minDistanceSq = distanceSq;
        closestEnemy = enemy;
      }
    }
    return closestEnemy;
  }

  private createProjectile(soldier: Soldier, target: Enemy): Projectile {
    const weaponSpec = WEAPON_DATA[soldier.weapon];
    const direction: Vec2 = [target.pos[0] - soldier.pos[0], target.pos[1] - soldier.pos[1]];
    const distance = Math.sqrt(direction[0]**2 + direction[1]**2);

    if (distance === 0) return null as unknown as Projectile;

    const normalizedDir: Vec2 = [direction[0] / distance, direction[1] / distance];
    const angle = Math.atan2(normalizedDir[1], normalizedDir[0]);
    const dispersedAngle = randomNormal(angle, weaponSpec.dispersionSigma);
    const finalDir: Vec2 = [Math.cos(dispersedAngle), Math.sin(dispersedAngle)];
    const vel: Vec2 = [finalDir[0] * weaponSpec.muzzleSpeed, finalDir[1] * weaponSpec.muzzleSpeed];

    return {
      id: uuidv4(),
      fromId: soldier.id,
      origin: [...soldier.pos],
      pos: [...soldier.pos],
      vel: vel,
      life: 5,
      damage: weaponSpec.damage,
      tracer: Math.random() * weaponSpec.tracerRatio < 1,
    };
  }
}

export const weaponSystem = new WeaponSystem();
