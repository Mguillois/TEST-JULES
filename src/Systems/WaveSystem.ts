import { WaveSpec, Enemy } from '../Core/Types';
import { v4 as uuidv4 } from 'uuid';

const M1_WAVE_1: WaveSpec = {
  index: 1,
  spawnCount: 10,
  cadence: 1, // 1 enemy per second
  composition: [{ type: 'rifle', weight: 1 }],
  pathVariantWeights: [1], // Only one path
};

class WaveSystem {
  private currentWave: WaveSpec | null = null;
  private spawnTimer = 0;
  private spawnedCount = 0;
  private waveInProgress = false;

  private startNextWave() {
    // For M1, we only have one wave.
    this.currentWave = M1_WAVE_1;
    this.spawnTimer = 0;
    this.spawnedCount = 0;
    this.waveInProgress = true;
    console.log(`Wave ${this.currentWave.index} started!`);
  }

  public update(dt: number): Enemy[] {
    if (!this.waveInProgress) {
      // For now, start the first wave after a short delay.
      // A more robust system would trigger this based on player action or a timer.
      if (!this.currentWave) {
          setTimeout(() => this.startNextWave(), 3000); // Wait 3s before starting
          this.currentWave = { index: 0, spawnCount: 0, cadence: 0, composition: [], pathVariantWeights: [] }; // Dummy wave to prevent re-trigger
      }
      return [];
    }

    if (!this.currentWave || this.spawnedCount >= this.currentWave.spawnCount) {
      // Wave is over.
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
    const xPos = (Math.random() - 0.5) * 40; // Spawn in a random-ish X position in a 40m wide lane
    const zPos = -40; // Start at the top of the 80m deep playfield

    return {
      id: uuidv4(),
      pos: [xPos, zPos],
      state: 'Advance',
      pathId: 'main',
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
