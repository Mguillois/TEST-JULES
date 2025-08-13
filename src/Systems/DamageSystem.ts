import { Enemy } from '../Core/Types';

// This Hit type will be defined and exported from ProjectileSystem
// For now, we define it here to satisfy TypeScript.
export interface Hit {
  enemyId: string;
  damage: number;
}

class DamageSystem {
  /**
   * Applies damage from hits to a list of enemies.
   * @param enemies The current array of enemies.
   * @param hits An array of hit events from the collision detection system.
   * @returns A new array of enemies with updated health, with dead enemies removed.
   */
  public applyHits(enemies: Enemy[], hits: Hit[]): Enemy[] {
    if (hits.length === 0) {
      return enemies;
    }

    // Create a map to aggregate damage per enemy ID for efficiency
    const damageMap = new Map<string, number>();
    for (const hit of hits) {
      damageMap.set(hit.enemyId, (damageMap.get(hit.enemyId) || 0) + hit.damage);
    }

    // Apply the aggregated damage to each affected enemy
    const updatedEnemies = enemies.map(enemy => {
      if (damageMap.has(enemy.id)) {
        const totalDamage = damageMap.get(enemy.id)!;
        // Apply armor damage reduction
        const absorbedDamage = totalDamage * (1 - enemy.armor);
        const newHp = enemy.hp - absorbedDamage;
        return { ...enemy, hp: newHp };
      }
      return enemy;
    });

    // Filter out enemies that have been killed
    return updatedEnemies.filter(enemy => enemy.hp > 0);
  }
}

export const damageSystem = new DamageSystem();
