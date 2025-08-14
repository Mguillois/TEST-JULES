import { describe, it, expect } from 'vitest';
import { playerAISystem } from './PlayerAISystem';
import { Soldier } from '../Core/Types';

const mockSoldier: Omit<Soldier, 'id' | 'pos' | 'moveTarget'> = {
    team: 'Player', hp: 100, armor: 0, weapon: 'rifle', classId: 'rifleman',
    fireCooldown: 0, actionCooldown: 0, aimSpread: 0,
    suppressed: 0, xp: 0
};

describe('PlayerAISystem', () => {
    it('should move a soldier towards their moveTarget', () => {
        const soldiers: Soldier[] = [
            { id: 's1', pos: [0, 0], moveTarget: [10, 0], ...mockSoldier },
        ];
        const updatedSoldiers = playerAISystem.update(1, soldiers, false); // 1 second, no rain
        expect(updatedSoldiers[0].pos[0]).toBe(2); // PLAYER_MOVE_SPEED is 2.0
        expect(updatedSoldiers[0].pos[1]).toBe(0);
    });

    it('should not move a soldier without a moveTarget', () => {
        const soldiers: Soldier[] = [
            { id: 's1', pos: [0, 0], moveTarget: null, ...mockSoldier },
        ];
        const updatedSoldiers = playerAISystem.update(1, soldiers, false);
        expect(updatedSoldiers[0].pos[0]).toBe(0);
        expect(updatedSoldiers[0].pos[1]).toBe(0);
    });

    it('should set moveTarget to null when the destination is reached', () => {
        const soldiers: Soldier[] = [
            { id: 's1', pos: [9.9, 0], moveTarget: [10, 0], ...mockSoldier },
        ];
        const updatedSoldiers = playerAISystem.update(0.1, soldiers, false);
        expect(updatedSoldiers[0].moveTarget).toBeNull();
    });

    it('should slow down the soldier when it is raining', () => {
        const soldiers: Soldier[] = [
            { id: 's1', pos: [0, 0], moveTarget: [10, 0], ...mockSoldier },
        ];
        const updatedSoldiers = playerAISystem.update(1, soldiers, true); // 1 second, with rain
        // BASE_PLAYER_MOVE_SPEED * MUD_SLOWDOWN_FACTOR = 2.0 * 0.8 = 1.6
        expect(updatedSoldiers[0].pos[0]).toBe(1.6);
    });
});
