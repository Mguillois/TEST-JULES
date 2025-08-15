import type { Soldier, Vec2 } from '../Core/Types';

const BASE_PLAYER_MOVE_SPEED = 2.0; // m/s
const MUD_SLOWDOWN_FACTOR = 0.8; // 20% speed reduction in rain
const TARGET_RADIUS_SQ = 0.25 * 0.25;

class PlayerAISystem {
  /**
   * Updates player soldier positions based on their move orders.
   * @param dt Delta time.
   * @param soldiers The array of player soldiers.
   * @param isRaining Whether it is currently raining.
   * @returns A new array of soldiers with updated positions.
   */
  public update(dt: number, soldiers: Soldier[], isRaining: boolean): Soldier[] {
    const currentSpeed = isRaining ? BASE_PLAYER_MOVE_SPEED * MUD_SLOWDOWN_FACTOR : BASE_PLAYER_MOVE_SPEED;

    return soldiers.map(soldier => {
      if (!soldier.moveTarget) {
        return soldier;
      }

      const direction: Vec2 = [soldier.moveTarget[0] - soldier.pos[0], soldier.moveTarget[1] - soldier.pos[1]];
      const distanceSq = direction[0]**2 + direction[1]**2;

      if (distanceSq < TARGET_RADIUS_SQ) {
        return { ...soldier, moveTarget: null };
      } else {
        const distance = Math.sqrt(distanceSq);
        const normalizedDir: Vec2 = [direction[0] / distance, direction[1] / distance];
        const newPos: Vec2 = [
            soldier.pos[0] + normalizedDir[0] * currentSpeed * dt,
            soldier.pos[1] + normalizedDir[1] * currentSpeed * dt
        ];
        return { ...soldier, pos: newPos };
      }
    });
  }
}

export const playerAISystem = new PlayerAISystem();
