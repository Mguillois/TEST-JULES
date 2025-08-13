import { describe, it, expect } from 'vitest';
import { projectileSystem } from './ProjectileSystem';
import { Projectile, Enemy } from '../Core/Types';

describe('projectileSystem', () => {
  describe('update', () => {
    const mockEnemy: Omit<Enemy, 'id' | 'pos'> = {
        hp: 100, armor: 0, team: 'Enemy', weapon: 'rifle', classId: 'rifleman',
        fireCooldown: 0, aimSpread: 0, suppressed: 0, xp: 0,
        pathId: 'p1', state: 'Advance'
    };

    it('should move projectiles based on their velocity and dt', () => {
      const projectiles: Projectile[] = [
        { id: 'p1', fromId: 's1', origin: [0, 0], pos: [0, 0], vel: [10, 20], life: 1, damage: 10, tracer: false },
      ];
      const { updatedProjectiles } = projectileSystem.update(0.1, projectiles, []);
      expect(updatedProjectiles[0].pos[0]).toBeCloseTo(1);
      expect(updatedProjectiles[0].pos[1]).toBeCloseTo(2);
    });

    it('should decrease projectile life', () => {
      const projectiles: Projectile[] = [
        { id: 'p1', fromId: 's1', origin: [0, 0], pos: [0, 0], vel: [0, 0], life: 1, damage: 10, tracer: false },
      ];
      const { updatedProjectiles } = projectileSystem.update(0.1, projectiles, []);
      expect(updatedProjectiles[0].life).toBeCloseTo(0.9);
    });

    it('should remove projectiles whose life is <= 0', () => {
        const projectiles: Projectile[] = [
          { id: 'p1', fromId: 's1', origin: [0, 0], pos: [0, 0], vel: [0, 0], life: 0.1, damage: 10, tracer: false },
        ];
        const { updatedProjectiles } = projectileSystem.update(0.2, projectiles, []);
        expect(updatedProjectiles.length).toBe(0);
    });

    it('should detect a hit and consume the projectile', () => {
      const projectiles: Projectile[] = [
        { id: 'p1', fromId: 's1', origin: [0, 0], pos: [0, 0], vel: [10, 0], life: 1, damage: 10, tracer: false },
      ];
      const enemies: Enemy[] = [{ id: 'e1', pos: [0.5, 0], ...mockEnemy }];
      const { updatedProjectiles, hits } = projectileSystem.update(0.1, projectiles, enemies);
      expect(hits.length).toBe(1);
      expect(hits[0].enemyId).toBe('e1');
      expect(updatedProjectiles.length).toBe(0);
    });

    it('should not detect a hit for a distant enemy', () => {
        const projectiles: Projectile[] = [
          { id: 'p1', fromId: 's1', origin: [0, 0], pos: [0, 0], vel: [10, 0], life: 1, damage: 10, tracer: false },
        ];
        const enemies: Enemy[] = [{ id: 'e1', pos: [50, 50], ...mockEnemy }];
        const { updatedProjectiles, hits } = projectileSystem.update(0.1, projectiles, enemies);
        expect(hits.length).toBe(0);
        expect(updatedProjectiles.length).toBe(1);
    });
  });
});
