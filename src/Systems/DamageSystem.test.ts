import { describe, it, expect } from 'vitest';
import { damageSystem, Hit } from './DamageSystem';
import { Enemy } from '../Core/Types';

describe('damageSystem', () => {
  describe('applyHits', () => {
    const mockEnemy: Omit<Enemy, 'id' | 'hp' | 'armor'> = {
      pos: [0, 0], team: 'Enemy', weapon: 'rifle', classId: 'rifleman',
      fireCooldown: 0, aimSpread: 0, suppressed: 0, xp: 0,
      pathId: 'p1', state: 'Advance'
    };

    const enemies: Enemy[] = [
      { id: 'e1', hp: 100, armor: 0.1, ...mockEnemy },
      { id: 'e2', hp: 20, armor: 0, ...mockEnemy },
      { id: 'e3', hp: 100, armor: 0, ...mockEnemy },
    ];

    it('should apply damage correctly considering armor', () => {
      const hits: Hit[] = [{ enemyId: 'e1', damage: 50 }];
      const updatedEnemies = damageSystem.applyHits(enemies, hits);
      const enemy1 = updatedEnemies.find(e => e.id === 'e1');
      // Damage calculation: 100 - (50 * (1 - 0.1)) = 100 - 45 = 55
      expect(enemy1?.hp).toBe(55);
    });

    it('should remove enemies whose hp drops to 0 or less', () => {
      const hits: Hit[] = [{ enemyId: 'e2', damage: 30 }];
      const updatedEnemies = damageSystem.applyHits(enemies, hits);
      const enemy2 = updatedEnemies.find(e => e.id === 'e2');
      expect(enemy2).toBeUndefined();
      expect(updatedEnemies.length).toBe(2);
    });

    it('should handle multiple hits on the same enemy in one frame', () => {
      const hits: Hit[] = [
        { enemyId: 'e1', damage: 20 },
        { enemyId: 'e1', damage: 30 },
      ];
      const updatedEnemies = damageSystem.applyHits(enemies, hits);
      const enemy1 = updatedEnemies.find(e => e.id === 'e1');
      // Damage calculation: 100 - ((20 + 30) * (1 - 0.1)) = 100 - 45 = 55
      expect(enemy1?.hp).toBe(55);
    });

    it('should return the original array if there are no hits', () => {
      const updatedEnemies = damageSystem.applyHits(enemies, []);
      expect(updatedEnemies).toBe(enemies);
    });

    it('should not affect enemies that were not hit', () => {
        const hits: Hit[] = [{ enemyId: 'e1', damage: 10 }];
        const updatedEnemies = damageSystem.applyHits(enemies, hits);
        const enemy3 = updatedEnemies.find(e => e.id === 'e3');
        expect(enemy3?.hp).toBe(100);
    });
  });
});
