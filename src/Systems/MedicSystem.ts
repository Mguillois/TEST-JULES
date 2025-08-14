import { Soldier, Vec2 } from '../Core/Types';

const HEAL_AMOUNT = 15;
const HEAL_COOLDOWN = 2.5; // seconds
const HEAL_RANGE_SQ = 5 * 5; // 5 meter range

const distSq = (a: Vec2, b: Vec2) => (a[0] - b[0])**2 + (a[1] - b[1])**2;

class MedicSystem {
  public update(dt: number, soldiers: Soldier[]): Soldier[] {
    const medics = soldiers.filter(s => s.classId === 'medic');
    const potentialTargets = soldiers.filter(s => s.hp < 100);

    // Exit early if there's no work to do
    if (medics.length === 0) return soldiers;

    const soldierMap = new Map(soldiers.map(s => [s.id, { ...s }]));

    for (const medic of medics) {
      const medicData = soldierMap.get(medic.id)!;
      medicData.actionCooldown = Math.max(0, medicData.actionCooldown - dt);

      if (medicData.actionCooldown > 0) continue; // Not ready to heal yet

      // Find a target if the medic is ready
      let bestTarget: Soldier | null = null;
      let lowestHp = 100;

      // Only search for targets if there are any wounded soldiers
      if (potentialTargets.length > 0) {
        for (const target of potentialTargets) {
            if (target.id === medic.id) continue;
            // Check range and if the target is actually in our map (not yet healed this frame)
            const targetData = soldierMap.get(target.id);
            if (targetData && targetData.hp < 100 && distSq(medic.pos, target.pos) < HEAL_RANGE_SQ) {
                if (targetData.hp < lowestHp) {
                    lowestHp = targetData.hp;
                    bestTarget = targetData;
                }
            }
        }
      }

      if (bestTarget) {
        console.log(`Medic ${medic.id} is healing ${bestTarget.id}`);
        bestTarget.hp = Math.min(100, bestTarget.hp + HEAL_AMOUNT);
        medicData.actionCooldown = HEAL_COOLDOWN; // Reset cooldown after healing
      }
    }

    return Array.from(soldierMap.values());
  }
}

export const medicSystem = new MedicSystem();
