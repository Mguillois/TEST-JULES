import { Soldier, Enemy, Projectile, Vec2, Vec3 } from '../Core/Types';
import { WEAPON_DATA } from '../Core/data';
import { randomNormal } from '../Core/Utils';
import { v4 as uuidv4 } from 'uuid';
import { researchSystem } from './ResearchSystem';
import { soundSystem } from './SoundSystem';
import { WORLD_WIDTH, WORLD_DEPTH } from '../State/slices/world';

const distSq = (a: Vec2, b: Vec2) => (a[0] - b[0])**2 + (a[1] - b[1])**2;

class WeaponSystem {
  public update(
    dt: number,
    soldiers: Soldier[],
    enemies: Enemy[],
    currentAmmo: number,
    terrain: number[][]
  ): { newProjectiles: Projectile[]; updatedSoldiers: Soldier[]; muzzleFlashPositions: Vec2[] } {
    const newProjectiles: Projectile[] = [];
    const muzzleFlashPositions: Vec2[] = [];

    const updatedSoldiers = soldiers.map(soldier => {
      const newCooldown = soldier.fireCooldown - dt;

      if (newCooldown <= 0 && enemies.length > 0 && currentAmmo > 0) {
        const target = this.findClosestEnemy(soldier, enemies);
        if (target) {
          const weaponSpec = WEAPON_DATA[soldier.weapon];
          if (!weaponSpec) return { ...soldier, fireCooldown: 0 };

          const arrayX = Math.round(soldier.pos[0] + WORLD_WIDTH / 2);
          const arrayZ = Math.round(soldier.pos[1] + WORLD_DEPTH / 2);
          const isInTrench = terrain[arrayX]?.[arrayZ] < 0;

          const fireRateModifier = researchSystem.getFireRateModifier(isInTrench);
          const fireInterval = (60 / weaponSpec.roundsPerMinute) / fireRateModifier;

          const projectile = this.createProjectile(soldier, target);
          newProjectiles.push(projectile);
          muzzleFlashPositions.push(soldier.pos);
          soundSystem.playSound('gunshot_rifle');

          return { ...soldier, fireCooldown: fireInterval };
        }
      }
      return { ...soldier, fireCooldown: newCooldown > 0 ? newCooldown : 0 };
    });

    return { newProjectiles, updatedSoldiers, muzzleFlashPositions };
  }

  private findClosestEnemy(soldier: Soldier, enemies: Enemy[]): Enemy | null {
    const baseRange = 35;
    const rangeBonus = researchSystem.getFiringRangeModifier();
    let minDistanceSq = (baseRange + rangeBonus)**2;

    let closestEnemy: Enemy | null = null;
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
    const origin: Vec3 = [soldier.pos[0], 0.8, soldier.pos[1]]; // Start projectile from barrel height
    const targetPos: Vec3 = [target.pos[0], 0.5, target.pos[1]]; // Aim for center mass

    const direction: Vec3 = [targetPos[0] - origin[0], 0, targetPos[2] - origin[2]]; // Flat trajectory for now
    const distance = Math.sqrt(direction[0]**2 + direction[2]**2);
    if (distance === 0) return null as unknown as Projectile;

    const normalizedDir: Vec2 = [direction[0] / distance, direction[2] / distance];
    const angle = Math.atan2(normalizedDir[1], normalizedDir[0]);
    const dispersedAngle = randomNormal(angle, weaponSpec.dispersionSigma);

    const finalDir: Vec2 = [Math.cos(dispersedAngle), Math.sin(dispersedAngle)];
    const vel: Vec3 = [finalDir[0] * weaponSpec.muzzleSpeed, 0, finalDir[1] * weaponSpec.muzzleSpeed];

    return { id: uuidv4(), fromId: soldier.id, origin: origin, pos: [...origin], vel: vel, life: 5, damage: weaponSpec.damage, tracer: Math.random() * weaponSpec.tracerRatio < 1 };
  }
}

export const weaponSystem = new WeaponSystem();
