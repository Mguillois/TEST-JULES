import { describe, it, expect } from 'vitest';
import { engineerSystem } from './EngineerSystem';
import { Soldier, Buildable } from '../Core/Types';

const mockSoldier: Omit<Soldier, 'id' | 'hp' | 'classId' | 'pos'> = {
    team: 'Player', armor: 0, weapon: 'rifle',
    fireCooldown: 0, actionCooldown: 0, aimSpread: 0,
    suppressed: 0, xp: 0, moveTarget: null
};

const mockBuilding: Omit<Buildable, 'id' | 'hp' | 'kind'> = {
    cells: [[0, 0]], level: 1,
};

describe('EngineerSystem', () => {
    it('should repair the most damaged building in range', () => {
        const soldiers: Soldier[] = [
            { id: 'eng1', classId: 'engineer', hp: 100, pos: [0, 0], ...mockSoldier },
        ];
        const buildings: Buildable[] = [
            { id: 'wire1', kind: 'BarbedWire', hp: 50, ...mockBuilding, cells: [[1, 1]] },
            { id: 'depot1', kind: 'Depot', hp: 100, ...mockBuilding, cells: [[2, 2]] }, // More damaged in terms of %
        ];
        // getMaxHp for BarbedWire is 100, for Depot is 500. Depot is missing 400hp, wire is missing 50.
        const { updatedBuildings } = engineerSystem.update(0.1, soldiers, buildings);
        const repairedBuilding = updatedBuildings.find(b => b.id === 'depot1');
        expect(repairedBuilding?.hp).toBe(100 + 20); // REPAIR_AMOUNT is 20
    });

    it('should not repair buildings out of range', () => {
        const soldiers: Soldier[] = [
            { id: 'eng1', classId: 'engineer', hp: 100, pos: [0, 0], ...mockSoldier },
        ];
        const buildings: Buildable[] = [
            { id: 'wire1', kind: 'BarbedWire', hp: 50, ...mockBuilding, cells: [[10, 10]] },
        ];
        const { updatedBuildings } = engineerSystem.update(0.1, soldiers, buildings);
        expect(updatedBuildings[0].hp).toBe(50);
    });

    it('should put the engineer on cooldown after repairing', () => {
        const soldiers: Soldier[] = [
            { id: 'eng1', classId: 'engineer', hp: 100, pos: [0, 0], ...mockSoldier },
        ];
        const buildings: Buildable[] = [
            { id: 'wire1', kind: 'BarbedWire', hp: 50, ...mockBuilding, cells: [[1, 1]] },
        ];
        const { updatedSoldiers } = engineerSystem.update(0.1, soldiers, buildings);
        const engineer = updatedSoldiers.find(s => s.id === 'eng1');
        expect(engineer?.actionCooldown).toBe(2); // REPAIR_COOLDOWN is 2
    });
});
