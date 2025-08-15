import { describe, it, expect } from 'vitest';
import { projectileSystem } from './ProjectileSystem';
import type { Projectile, Enemy } from '../Core/Types';

describe('projectileSystem', () => {
  describe('update', () => {
    const mockEnemy: Omit<Enemy, 'id' | 'pos'> = {
        hp: 100, armor: 0, weapon: 'rifle', classId: 'rifleman',
        fireCooldown: 0, suppressed: 0, xp: 0,
        pathId: 'p1', state: 'Advance', waypointIndex: 0, pauseTimer: 0, moveTarget: null
    };

    it('should move projectiles based on their velocity and dt', () => {
      const projectiles: Projectile[] = [
        { id: 'p1', fromId: 's1', origin: [0, 0, 0], pos: [0, 0.5, 0], vel: [10, 5, 20], life: 1, damage: 10, tracer: false },
      ];
      const { updatedProjectiles } = projectileSystem.update(0.1, projectiles, []);
      expect(updatedProjectiles[0].pos[0]).toBeCloseTo(1);
      // y position = 0.5 + (5 * 0.1) - (9.81 * 0.1^2 / 2) - wait, gravity is applied to velocity.
      // new vel.y = 5 - 9.81 * 0.1 = 4.019
      // new pos.y = 0.5 + 4.019 * 0.1 = 0.9019
      expect(updatedProjectiles[0].pos[1]).toBeCloseTo(0.5 + (5 - 9.81 * 0.1) * 0.1);
      expect(updatedProjectiles[0].pos[2]).toBeCloseTo(2);
    });

    it('should detect hits and consume projectiles', () => {
      const projectiles: Projectile[] = [
        { id: 'p1', fromId: 's1', origin: [0,0,0], pos: [0, 0.5, 0], vel: [10, 0, 0], life: 1, damage: 10, tracer: false },
      ];
      const enemies: Enemy[] = [{ id: 'e1', pos: [0.5, 0], ...mockEnemy }];
      const { updatedProjectiles, hits } = projectileSystem.update(0.1, projectiles, enemies);
      expect(hits.length).toBe(1);
      expect(hits[0].enemyId).toBe('e1');
      expect(updatedProjectiles.length).toBe(0);
    });

    it('should create an impact when a projectile hits the ground', () => {
        const projectiles: Projectile[] = [
            { id: 'p1', fromId: 's1', origin: [0,0,0], pos: [0, 0.5, 0], vel: [0, -10, 0], life: 1, damage: 10, tracer: false },
        ];
        const { impacts } = projectileSystem.update(0.1, projectiles, []);
        expect(impacts.length).toBe(1);
        expect(impacts[0][1]).toBe(0); // y-position of impact should be 0
    });
  });
});
