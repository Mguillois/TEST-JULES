import { Enemy } from '../Core/Types';
import { WORLD_WIDTH, WORLD_DEPTH } from '../State/slices/world';
import { soundSystem } from './SoundSystem';

export interface Hit {
  enemyId: string;
  damage: number;
}

class DamageSystem {
  public applyHits(enemies: Enemy[], hits: Hit[], terrain: number[][]): Enemy[] {
    if (hits.length === 0) {
      return enemies;
    }

    const damageMap = new Map<string, number>();
    for (const hit of hits) {
      damageMap.set(hit.enemyId, (damageMap.get(hit.enemyId) || 0) + hit.damage);
      soundSystem.playSound('impact_flesh');
    }

    const updatedEnemies = enemies.map(enemy => {
      if (damageMap.has(enemy.id)) {
        let totalDamage = damageMap.get(enemy.id)!;

        // Check for cover
        const isStationary = enemy.state === 'Pause' || enemy.state === 'Fire';
        const arrayX = Math.round(enemy.pos[0] + WORLD_WIDTH / 2);
        const arrayZ = Math.round(enemy.pos[1] + WORLD_DEPTH / 2);

        if (arrayX >= 0 && arrayX < WORLD_WIDTH && arrayZ >= 0 && arrayZ < WORLD_DEPTH) {
            const terrainHeight = terrain[arrayX][arrayZ];
            if (isStationary && terrainHeight < 0) { // In a trench and stationary
                totalDamage *= 0.7; // 30% damage reduction
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
