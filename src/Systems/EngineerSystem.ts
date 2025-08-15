import type { Soldier, Buildable, Vec2 } from '../Core/Types';
import { buildSystem } from './BuildSystem';

const REPAIR_AMOUNT = 20;
const REPAIR_COOLDOWN = 2; // seconds
const REPAIR_RANGE_SQ = 6 * 6; // 6 meter range

const distSq = (a: Vec2, b: Vec2) => (a[0] - b[0])**2 + (a[1] - b[1])**2;

class EngineerSystem {
  public update(dt: number, soldiers: Soldier[], buildings: Buildable[]): { updatedSoldiers: Soldier[], updatedBuildings: Buildable[] } {
    const engineers = soldiers.filter(s => s.classId === 'engineer');
    const damagedBuildings = buildings.filter(b => b.hp < buildSystem.getMaxHp(b.kind as any));

    if (engineers.length === 0 || damagedBuildings.length === 0) {
      const updatedSoldiers = soldiers.map(s => {
          if (s.classId === 'engineer') return { ...s, actionCooldown: Math.max(0, s.actionCooldown - dt) };
          return s;
      });
      return { updatedSoldiers, updatedBuildings: buildings };
    }

    const soldierMap = new Map(soldiers.map(s => [s.id, { ...s }]));
    const buildingMap = new Map(buildings.map(b => [b.id, { ...b }]));

    for (const engineer of engineers) {
      const engineerData = soldierMap.get(engineer.id)!;
      engineerData.actionCooldown = Math.max(0, engineerData.actionCooldown - dt);

      if (engineerData.actionCooldown > 0) continue;

      let bestTarget: Buildable | null = null;
      let mostDamage = 0;

      for (const target of damagedBuildings) {
        const targetData = buildingMap.get(target.id);
        if (!targetData) continue; // Already processed by another engineer? Should not happen with this logic.

        const maxHp = buildSystem.getMaxHp(targetData.kind as any);
        if (targetData.hp >= maxHp) continue; // Already fully repaired this frame

        if (distSq(engineer.pos, targetData.cells[0]) < REPAIR_RANGE_SQ) {
            const damage = maxHp - targetData.hp;
            if (damage > mostDamage) {
                mostDamage = damage;
                bestTarget = targetData;
            }
        }
      }

      if (bestTarget) {
        console.log(`Engineer ${engineer.id} is repairing ${bestTarget.kind} ${bestTarget.id}`);
        const maxHp = buildSystem.getMaxHp(bestTarget.kind as any);
        bestTarget.hp = Math.min(maxHp, bestTarget.hp + REPAIR_AMOUNT);
        engineerData.actionCooldown = REPAIR_COOLDOWN;
      }
    }

    return {
      updatedSoldiers: Array.from(soldierMap.values()),
      updatedBuildings: Array.from(buildingMap.values()),
    };
  }
}

export const engineerSystem = new EngineerSystem();
