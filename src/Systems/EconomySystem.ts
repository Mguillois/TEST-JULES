import type { Buildable } from '../Core/Types';
import { BUILDING_INCOME } from '../Core/data';

interface Income {
    ammo: number;
    materials: number;
    manpower: number;
}

class EconomySystem {
  private incomeTimer = 0;
  private readonly INCOME_INTERVAL = 1; // Calculate income every 1 second

  /**
   * Updates the economy, calculating income based on placed buildings.
   * @param dt Delta time.
   * @param buildings The array of placed buildings.
   * @returns The amount of resources to add to the player's inventory this frame.
   */
  public update(dt: number, buildings: Buildable[]): Income {
    this.incomeTimer += dt;

    if (this.incomeTimer >= this.INCOME_INTERVAL) {
      this.incomeTimer -= this.INCOME_INTERVAL;

      const incomePerMinute = { ammo: 0, materials: 0, manpower: 0 };

      for (const building of buildings) {
          const buildingIncome = BUILDING_INCOME[building.kind];
          if (buildingIncome) {
              incomePerMinute.ammo += buildingIncome.ammo || 0;
              incomePerMinute.materials += buildingIncome.materials || 0;
              incomePerMinute.manpower += buildingIncome.manpower || 0;
          }
      }

      const incomePerSecond = {
          ammo: incomePerMinute.ammo / 60,
          materials: incomePerMinute.materials / 60,
          manpower: incomePerMinute.manpower / 60,
      };

      return incomePerSecond;
    }

    return { ammo: 0, materials: 0, manpower: 0 };
  }
}

export const economySystem = new EconomySystem();
