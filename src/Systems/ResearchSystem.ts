import { useStore } from '../State/store';
import { TechId } from '../Core/Types';

class ResearchSystem {
  /**
   * Checks if a given technology has been unlocked.
   * @param techId The ID of the technology to check.
   * @returns True if the technology is unlocked, false otherwise.
   */
  public isTechUnlocked(techId: TechId): boolean {
    // This is a live lookup into the store.
    return useStore.getState().unlockedTechIds.includes(techId);
  }

  /**
   * Gets the firing range bonus from unlocked technologies.
   * @returns A number representing the additional range in meters.
   */
  public getFiringRangeModifier(): number {
    if (this.isTechUnlocked('optics')) {
      return 5; // 'Improved Optics' adds 5m to range
    }
    return 0;
  }

  /**
   * Gets the fire rate multiplier from unlocked technologies.
   * @param isInTrench Whether the firing unit is in a trench.
   * @returns A multiplier for the fire rate (e.g., 1.2 for a 20% increase).
   */
  public getFireRateModifier(isInTrench: boolean): number {
    if (isInTrench && this.isTechUnlocked('trench_periscope')) {
        return 1.2; // 20% faster fire rate
    }
    return 1.0; // No modifier
  }
}

export const researchSystem = new ResearchSystem();
