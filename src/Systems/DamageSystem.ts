import type { Enemy, Vec2, Vec3 } from '../Core/Types';
import { WORLD_WIDTH, WORLD_DEPTH } from '../State/slices/world';
import { soundSystem } from './SoundSystem';
import type { Explosion } from './ProjectileSystem';

export interface Hit {
  enemyId: string;
  damage: number;
}

const distSq3D = (a: Vec3, b: Vec2) => (a[0] - b[0])**2 + (a[1] - 0.5)**2 + (a[2] - b[1])**2;

class DamageSystem {
  public applyHits(enemies: Enemy[], hits: Hit[], terrain: number[][], explosions: Explosion[]): Enemy[] {
    const damageMap = new Map<string, number>();

    // Process direct hits
    for (const hit of hits) {
      damageMap.set(hit.enemyId, (damageMap.get(hit.enemyId) || 0) + hit.damage);
      soundSystem.playSound('impact_flesh');
    }

    // Process AOE damage from explosions
    for (const explosion of explosions) {
        // TODO: Create visual effect for explosion
        for (const enemy of enemies) {
            const distanceSq = distSq3D(explosion.position, enemy.pos);
            if (distanceSq < explosion.radius**2) {
                // Apply damage with falloff (simple linear falloff)
                const distance = Math.sqrt(distanceSq);
                const falloff = 1 - (distance / explosion.radius);
                const damage = explosion.damage * falloff;
                damageMap.set(enemy.id, (damageMap.get(enemy.id) || 0) + damage);
            }
        }
    }

    if (damageMap.size === 0) {
      return enemies;
    }

    const updatedEnemies = enemies.map(enemy => {
      if (damageMap.has(enemy.id)) {
        let totalDamage = damageMap.get(enemy.id)!;

        const isStationary = enemy.state === 'Pause' || enemy.state === 'Fire';
        const arrayX = Math.round(enemy.pos[0] + WORLD_WIDTH / 2);
        const arrayZ = Math.round(enemy.pos[1] + WORLD_DEPTH / 2);

        if (arrayX >= 0 && arrayX < WORLD_WIDTH && arrayZ >= 0 && arrayZ < WORLD_DEPTH) {
            const terrainHeight = terrain[arrayX][arrayZ];
            if (isStationary && terrainHeight < 0) {
                totalDamage *= 0.7;
            }
        }

        const absorbedDamage = totalDamage * (1 - enemy.armor);
        const newHp = enemy.hp - absorbedDamage;
        return { ...enemy, hp: newHp };
      }
      return enemy;
    });

    return updatedEnemies.filter(enemy => enemy.hp > 0);
  }
}

export const damageSystem = new DamageSystem();
