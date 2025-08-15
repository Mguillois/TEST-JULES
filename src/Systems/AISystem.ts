import type { Enemy, Vec2, Buildable } from '../Core/Types';
import { PATHS } from '../Core/paths';
import { buildSystem } from './BuildSystem';

const BASE_ADVANCE_SPEED = 1.3;
const MUD_SLOWDOWN_FACTOR = 0.8; // 20% speed reduction in rain
const WAYPOINT_RADIUS_SQ = 0.5 * 0.5;
const SAPPER_ATTACK_RANGE_SQ = 1.5 * 1.5;
const SAPPER_ATTACK_COOLDOWN = 2;
const SAPPER_ATTACK_DAMAGE = 25;

const distSq = (a: Vec2, b: Vec2) => (a[0] - b[0])**2 + (a[1] - b[1])**2;
function isPointInAABB(point: Vec2, building: Buildable): boolean {
    const size = buildSystem.getSize(building.kind.toLowerCase() as any);
    const minX = building.cells[0][0] - size[0] / 2;
    const maxX = building.cells[0][0] + size[0] / 2;
    const minZ = building.cells[0][1] - size[1] / 2;
    const maxZ = building.cells[0][1] + size[1] / 2;
    return point[0] >= minX && point[0] <= maxX && point[1] >= minZ && point[1] <= maxZ;
}

class AISystem {
  public update(dt: number, enemies: Enemy[], buildings: Buildable[], isRaining: boolean): { updatedEnemies: Enemy[], updatedBuildings: Buildable[] } {
    const barbedWire = buildings.filter(b => b.kind === 'BarbedWire');
    const buildingMap = new Map(buildings.map(b => [b.id, { ...b }]));

    const updatedEnemies = enemies.map(enemy => {
      if (enemy.classId === 'sapper') {
        return this.handleSapper(dt, enemy, barbedWire, buildingMap, isRaining);
      }
      return this.handleStandard(dt, enemy, barbedWire, isRaining);
    });

    return {
        updatedEnemies: updatedEnemies.filter(e => e.hp > 0),
        updatedBuildings: Array.from(buildingMap.values()).filter(b => b.hp > 0),
    };
  }

  private handleStandard(dt: number, enemy: Enemy, barbedWire: Buildable[], isRaining: boolean): Enemy {
    const path = PATHS[enemy.pathId];
    if (!path || enemy.waypointIndex >= path.length) return enemy;

    const isSlowedByWire = barbedWire.some(wire => isPointInAABB(enemy.pos, wire));
    let speed = BASE_ADVANCE_SPEED;
    if (isSlowedByWire) speed *= 0.4;
    if (isRaining) speed *= MUD_SLOWDOWN_FACTOR;

    const suppressionFactor = 1 - (enemy.suppression * 0.75);
    const finalSpeed = speed * suppressionFactor;

    if (enemy.state === 'Advance') return this.advanceOnPath(dt, enemy, path, finalSpeed);
    if (enemy.state === 'Pause') return this.pause(dt, enemy);
    return enemy;
  }

  private handleSapper(dt: number, sapper: Enemy, barbedWire: Buildable[], buildingMap: Map<string, Buildable>, isRaining: boolean): Enemy {
    let closestWire: Buildable | null = null;
    let minDistanceSq = Infinity;
    for (const wire of barbedWire) {
        const dSq = distSq(sapper.pos, wire.cells[0]);
        if (dSq < minDistanceSq) {
            minDistanceSq = dSq;
            closestWire = wire;
        }
    }

    if (!closestWire) return this.handleStandard(dt, sapper, [], isRaining);

    if (minDistanceSq < SAPPER_ATTACK_RANGE_SQ) {
        return this.attackBuilding(dt, sapper, closestWire, buildingMap);
    } else {
        return this.advanceToTarget(dt, sapper, closestWire.cells[0], isRaining);
    }
  }

  private attackBuilding(dt: number, sapper: Enemy, target: Buildable, buildingMap: Map<string, Buildable>): Enemy {
      let newPauseTimer = sapper.pauseTimer - dt;
      if (newPauseTimer <= 0) {
          const buildingData = buildingMap.get(target.id);
          if (buildingData) buildingData.hp -= SAPPER_ATTACK_DAMAGE;
          newPauseTimer = SAPPER_ATTACK_COOLDOWN;
      }
      return { ...sapper, state: 'Attacking', pauseTimer: newPauseTimer };
  }

  private advanceToTarget(dt: number, enemy: Enemy, targetPos: Vec2, isRaining: boolean): Enemy {
      let speed = BASE_ADVANCE_SPEED;
      if (isRaining) speed *= MUD_SLOWDOWN_FACTOR;
      const suppressionFactor = 1 - (enemy.suppression * 0.75);
      speed *= suppressionFactor;

      const direction: Vec2 = [targetPos[0] - enemy.pos[0], targetPos[1] - enemy.pos[1]];
      const distance = Math.sqrt(direction[0]**2 + direction[1]**2);
      const normalizedDir: Vec2 = [direction[0] / distance, direction[1] / distance];
      const newPos: Vec2 = [enemy.pos[0] + normalizedDir[0] * speed * dt, enemy.pos[1] + normalizedDir[1] * speed * dt];
      return { ...enemy, pos: newPos, state: 'Advance' };
  }

  private advanceOnPath(dt: number, enemy: Enemy, path: Vec2[], speed: number): Enemy {
    const targetWaypoint = path[enemy.waypointIndex];
    const direction: Vec2 = [targetWaypoint[0] - enemy.pos[0], targetWaypoint[1] - enemy.pos[1]];
    if (direction[0]**2 + direction[1]**2 < WAYPOINT_RADIUS_SQ) {
      return { ...enemy, state: 'Pause', pauseTimer: 0.5 + Math.random() * 0.5 };
    }
    const distance = Math.sqrt(direction[0]**2 + direction[1]**2);
    const normalizedDir: Vec2 = [direction[0] / distance, direction[1] / distance];
    const newPos: Vec2 = [enemy.pos[0] + normalizedDir[0] * speed * dt, enemy.pos[1] + normalizedDir[1] * speed * dt];
    return { ...enemy, pos: newPos };
  }

  private pause(dt: number, enemy: Enemy): Enemy {
    const newPauseTimer = enemy.pauseTimer - dt;
    if (newPauseTimer <= 0) {
      return { ...enemy, state: 'Advance', waypointIndex: enemy.waypointIndex + 1, pauseTimer: 0 };
    }
    return { ...enemy, pauseTimer: newPauseTimer };
  }
}

export const aiSystem = new AISystem();
