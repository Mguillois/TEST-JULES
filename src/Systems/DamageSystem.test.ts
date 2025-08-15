import { describe, it, expect } from 'vitest';
import { damageSystem } from './DamageSystem';
import type { Hit, Explosion } from './ProjectileSystem';
import type { Enemy } from '../Core/Types';

describe('damageSystem', () => {
  describe('applyHits', () => {
    const mockEnemy: Omit<Enemy, 'id' | 'hp' | 'armor'> = {
      pos: [0, 0], weapon: 'rifle', classId: 'rifleman',
      fireCooldown: 0, suppressed: 0, xp: 0,
      pathId: 'p1', state: 'Advance', waypointIndex: 0, pauseTimer: 0, moveTarget: null
    };

    const mockTerrain = Array(240).fill(0).map(() => Array(160).fill(0));
    const mockExplosions: Explosion[] = [];

    const enemies: Enemy[] = [
      { id: 'e1', hp: 100, armor: 0.1, ...mockEnemy },
      { id: 'e2', hp: 20, armor: 0, ...mockEnemy },
      { id: 'e3', hp: 100, armor: 0, ...mockEnemy },
    ];

    it('should apply damage correctly considering armor', () => {
      const hits: Hit[] = [{ enemyId: 'e1', damage: 50 }];
      const updatedEnemies = damageSystem.applyHits(enemies, hits, mockTerrain, mockExplosions);
      const enemy1 = updatedEnemies.find(e => e.id === 'e1');
      expect(enemy1?.hp).toBe(55);
    });

    it('should remove enemies with hp <= 0', () => {
      const hits: Hit[] = [{ enemyId: 'e2', damage: 30 }];
      const updatedEnemies = damageSystem.applyHits(enemies, hits, mockTerrain, mockExplosions);
      const enemy2 = updatedEnemies.find(e => e.id === 'e2');
      expect(enemy2).toBeUndefined();
    });

    it('should apply AOE damage from explosions', () => {
        const explosions: Explosion[] = [{ position: [0.5, 0, 0.5], radius: 5, damage: 40 }];
        const updatedEnemies = damageSystem.applyHits(enemies, [], mockTerrain, explosions);
        // All enemies are within 5m of the explosion
        expect(updatedEnemies.length).toBe(3);
        expect(updatedEnemies.find(e => e.id === 'e1')!.hp).toBeLessThan(100);
        expect(updatedEnemies.find(e => e.id === 'e2')!.hp).toBeLessThan(20);
        expect(updatedEnemies.find(e => e.id === 'e3')!.hp).toBeLessThan(100);
    });
  });
});
