import { Enemy } from '../Core/Types';

const ADVANCE_SPEED = 1.3; // m/s, from the project specification

class AISystem {
  /**
   * Updates the state of all enemies. For M1, this is just advancing them.
   * @param dt Delta time
   * @param enemies The current array of enemies
   * @returns A new array with the updated enemies
   */
  public update(dt: number, enemies: Enemy[]): Enemy[] {
    // Filter out enemies that have gone past the player's line or are dead
    const activeEnemies = enemies.filter(enemy => enemy.hp > 0 && enemy.pos[1] < 10);

    return activeEnemies.map(enemy => {
      if (enemy.state === 'Advance') {
        // Move the enemy forward along the Z axis
        const newPos: [number, number] = [enemy.pos[0], enemy.pos[1] + ADVANCE_SPEED * dt];
        return { ...enemy, pos: newPos };
      }
      return enemy;
    });
  }
}

export const aiSystem = new AISystem();
