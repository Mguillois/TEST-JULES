import { WaveSpec, Enemy } from '../Core/Types';
import { v4 as uuidv4 } from 'uuid';
import { PATHS } from '../Core/paths';

// A more complex wave for Phase 2
const M2_WAVE_1: WaveSpec = {
  index: 1,
  spawnCount: 20,
  cadence: 2, // 2 enemies per second
  composition: [{ type: 'rifle', weight: 1 }],
  pathVariantWeights: [0.3, 0.4, 0.3], // Weights for lane1, lane2, lane3
};

// Helper function to select an item based on weights
function chooseWeightedRandom<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((acc, w) => acc + w, 0);
    let random = Math.random() * totalWeight;
    for (let i = 0; i < items.length; i++) {
        if (random < weights[i]) {
            return items[i];
        }
        random -= weights[i];
    }
    return items[items.length - 1]; // Fallback
}

class WaveSystem {
  private currentWave: WaveSpec | null = null;
  private spawnTimer = 0;
  private spawnedCount = 0;
  private waveInProgress = false;

  private startNextWave() {
    this.currentWave = M2_WAVE_1;
    this.spawnTimer = 0;
    this.spawnedCount = 0;
    this.waveInProgress = true;
    console.log(`Wave ${this.currentWave.index} started!`);
  }

  public update(dt: number): Enemy[] {
    if (!this.waveInProgress && !this.currentWave) {
      setTimeout(() => this.startNextWave(), 3000);
      this.currentWave = { index: 0, spawnCount: 0, cadence: 0, composition: [], pathVariantWeights: [] }; // Dummy wave
      return [];
    }

    if (!this.currentWave || !this.waveInProgress || this.spawnedCount >= this.currentWave.spawnCount) {
      if (this.waveInProgress) {
          console.log(`Wave ${this.currentWave.index} complete.`);
          this.waveInProgress = false;
      }
      return [];
    }

    this.spawnTimer += dt;
    const spawnInterval = 1 / this.currentWave.cadence;

    if (this.spawnTimer >= spawnInterval) {
      this.spawnTimer -= spawnInterval;
      this.spawnedCount++;
      return [this.createEnemy()];
    }

    return [];
  }

  private createEnemy(): Enemy {
    const pathIds = Object.keys(PATHS);
    const weights = this.currentWave?.pathVariantWeights || pathIds.map(() => 1);
    const chosenPathId = chooseWeightedRandom(pathIds, weights);

    const startPos = PATHS[chosenPathId][0];

    return {
      id: uuidv4(),
      pos: [...startPos],
      state: 'Advance',
      pathId: chosenPathId,
      waypointIndex: 1, // Start moving towards the second waypoint (index 1)
      pauseTimer: 0,
      hp: 50,
      armor: 0,
      weapon: 'rifle',
      classId: 'rifleman',
      fireCooldown: 0,
      aimSpread: 0.2,
      suppressed: 0,
      xp: 5,
    };
  }
}

export const waveSystem = new WaveSystem();
