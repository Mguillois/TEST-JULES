import { describe, it, expect } from 'vitest';
import { medicSystem } from './MedicSystem';
import { Soldier } from '../Core/Types';

const mockSoldier: Omit<Soldier, 'id' | 'hp' | 'classId' | 'pos'> = {
    team: 'Player', armor: 0, weapon: 'rifle',
    fireCooldown: 0, actionCooldown: 0, aimSpread: 0,
    suppressed: 0, xp: 0, moveTarget: null
};

describe('MedicSystem', () => {
    it('should heal the most wounded soldier in range', () => {
        const soldiers: Soldier[] = [
            { id: 'medic1', classId: 'medic', hp: 100, pos: [0, 0], ...mockSoldier },
            { id: 'rifleman1', classId: 'rifleman', hp: 50, pos: [1, 1], ...mockSoldier },
            { id: 'rifleman2', classId: 'rifleman', hp: 20, pos: [2, 2], ...mockSoldier },
        ];
        const updatedSoldiers = medicSystem.update(0.1, soldiers);
        const healedSoldier = updatedSoldiers.find(s => s.id === 'rifleman2');
        expect(healedSoldier?.hp).toBe(20 + 15);
    });

    it('should not heal soldiers out of range', () => {
        const soldiers: Soldier[] = [
            { id: 'medic1', classId: 'medic', hp: 100, pos: [0, 0], ...mockSoldier },
            { id: 'rifleman1', classId: 'rifleman', hp: 50, pos: [10, 10], ...mockSoldier },
        ];
        const updatedSoldiers = medicSystem.update(0.1, soldiers);
        const healedSoldier = updatedSoldiers.find(s => s.id === 'rifleman1');
        expect(healedSoldier?.hp).toBe(50);
    });

    it('should put the medic on cooldown after healing', () => {
        const soldiers: Soldier[] = [
            { id: 'medic1', classId: 'medic', hp: 100, pos: [0, 0], ...mockSoldier },
            { id: 'rifleman1', classId: 'rifleman', hp: 50, pos: [1, 1], ...mockSoldier },
        ];
        const updatedSoldiers = medicSystem.update(0.1, soldiers);
        const medic = updatedSoldiers.find(s => s.id === 'medic1');
        expect(medic?.actionCooldown).toBe(2.5);
    });

    it('should not heal if on cooldown', () => {
        const soldiers: Soldier[] = [
            { id: 'medic1', classId: 'medic', hp: 100, actionCooldown: 2, pos: [0, 0], ...mockSoldier },
            { id: 'rifleman1', classId: 'rifleman', hp: 50, pos: [1, 1], ...mockSoldier },
        ];
        const updatedSoldiers = medicSystem.update(0.1, soldiers);
        const healedSoldier = updatedSoldiers.find(s => s.id === 'rifleman1');
        expect(healedSoldier?.hp).toBe(50);
    });
});
