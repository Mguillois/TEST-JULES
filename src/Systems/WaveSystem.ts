import { WaveSpec, Enemy, SoldierClassId } from '../Core/Types';
import { v4 as uuidv4 } from 'uuid';
import { PATHS } from '../Core/paths';

const M3_WAVE_1: WaveSpec = {
  index: 2,
  spawnCount: 25,
  cadence: 1.5,
  composition: [
      { type: 'rifle', weight: 0.8 },
      { type: 'sapper', weight: 0.2 },
    ],
  pathVariantWeights: [0.3, 0.4, 0.3],
};

function chooseWeightedRandom<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((acc, w) => acc + w, 0);
    let random = Math.random() * totalWeight;
    for (let i = 0; i < items.length; i++) {
        if (random < weights[i]) {
            return items[i];
        }
        random -= weights[i];
    }
    return items[items.length - 1];
}

class WaveSystem {
  private currentWave: WaveSpec | null = null;
  private spawnTimer = 0;
  private spawnedCount = 0;
  private waveInProgress = false;

  private startNextWave() {
    this.currentWave = M3_WAVE_1; // Use the new wave spec
    this.spawnTimer = 0;
    this.spawnedCount = 0;
    this.waveInProgress = true;
    console.log(`Wave ${this.currentWave.index} started!`);
  }

  public update(dt: number): Enemy[] {
    if (!this.waveInProgress && !this.currentWave) {
      setTimeout(() => this.startNextWave(), 5000); // Start after 5s
      this.currentWave = { index: 0, spawnCount: 0, cadence: 0, composition: [], pathVariantWeights: [] };
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
    const compositionTypes = this.currentWave!.composition.map(c => c.type);
    const compositionWeights = this.currentWave!.composition.map(c => c.weight);
    const chosenType = chooseWeightedRandom(compositionTypes, compositionWeights);

    const pathIds = Object.keys(PATHS);
    const pathWeights = this.currentWave?.pathVariantWeights || pathIds.map(() => 1);
    const chosenPathId = chooseWeightedRandom(pathIds, pathWeights);

    const startPos = PATHS[chosenPathId][0];

    return {
      id: uuidv4(),
      pos: [...startPos],
      state: 'Advance',
      pathId: chosenPathId,
      waypointIndex: 1,
      pauseTimer: 0,
      hp: chosenType === 'sapper' ? 65 : 50, // Sappers are tougher, but not tanks
      armor: chosenType === 'sapper' ? 0.1 : 0,
      weapon: 'rifle', // Sappers might not have a weapon, but the type requires it
      classId: chosenType as any, // The type system needs alignment here
      fireCooldown: 0,
      aimSpread: 0.2,
      suppressed: 0,
      xp: chosenType === 'sapper' ? 10 : 5,
    };
  }
}

export const waveSystem = new WaveSystem();
