import { Enemy, Vec2, Buildable } from '../Core/Types';
import { PATHS } from '../Core/paths';
import { buildSystem } from './BuildSystem';

const BASE_ADVANCE_SPEED = 1.3; // m/s
const WAYPOINT_RADIUS_SQ = 0.5 * 0.5;

// Helper to check if a point is inside a buildable's AABB
function isPointInAABB(point: Vec2, building: Buildable): boolean {
    const size = buildSystem.getSize(building.kind.toLowerCase() as 'wire');
    const minX = building.cells[0][0] - size[0] / 2;
    const maxX = building.cells[0][0] + size[0] / 2;
    const minZ = building.cells[0][1] - size[1] / 2;
    const maxZ = building.cells[0][1] + size[1] / 2;
    return point[0] >= minX && point[0] <= maxX && point[1] >= minZ && point[1] <= maxZ;
}

class AISystem {
  public update(dt: number, enemies: Enemy[], buildings: Buildable[]): Enemy[] {
    const barbedWire = buildings.filter(b => b.kind === 'BarbedWire');

    const updatedEnemies = enemies.map(enemy => {
      const path = PATHS[enemy.pathId];
      if (!path || enemy.waypointIndex >= path.length) return enemy;

      // Check if slowed by barbed wire
      const isSlowed = barbedWire.some(wire => isPointInAABB(enemy.pos, wire));
      const currentSpeed = isSlowed ? BASE_ADVANCE_SPEED * 0.4 : BASE_ADVANCE_SPEED; // 60% reduction

      switch (enemy.state) {
        case 'Advance':
          return this.handleAdvance(dt, enemy, path, currentSpeed);
        case 'Pause':
          return this.handlePause(dt, enemy);
        default:
          return enemy;
      }
    });

    return updatedEnemies.filter(enemy => {
        const path = PATHS[enemy.pathId];
        return path && enemy.waypointIndex < path.length;
    });
  }

  private handleAdvance(dt: number, enemy: Enemy, path: Vec2[], speed: number): Enemy {
    const targetWaypoint = path[enemy.waypointIndex];
    const direction: Vec2 = [targetWaypoint[0] - enemy.pos[0], targetWaypoint[1] - enemy.pos[1]];
    const distanceSq = direction[0]**2 + direction[1]**2;

    if (distanceSq < WAYPOINT_RADIUS_SQ) {
      const pauseDuration = 0.5 + Math.random() * 0.5;
      return { ...enemy, state: 'Pause', pauseTimer: pauseDuration };
    } else {
      const suppressionFactor = 1 - (enemy.suppression * 0.75); // At max suppression, speed is reduced by 75%
      const finalSpeed = speed * suppressionFactor;

      const distance = Math.sqrt(distanceSq);
      const normalizedDir: Vec2 = [direction[0] / distance, direction[1] / distance];
      const newPos: Vec2 = [
        enemy.pos[0] + normalizedDir[0] * finalSpeed * dt,
        enemy.pos[1] + normalizedDir[1] * finalSpeed * dt
      ];
      return { ...enemy, pos: newPos };
    }
  }

  private handlePause(dt: number, enemy: Enemy): Enemy {
    const newPauseTimer = enemy.pauseTimer - dt;
    if (newPauseTimer <= 0) {
      return { ...enemy, state: 'Advance', waypointIndex: enemy.waypointIndex + 1, pauseTimer: 0 };
    } else {
      return { ...enemy, pauseTimer: newPauseTimer };
    }
  }
}

export const aiSystem = new AISystem();
