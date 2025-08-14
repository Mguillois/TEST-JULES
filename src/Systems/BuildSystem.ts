import { Buildable, Vec2 } from '../Core/Types';
import { BuildMode } from '../State/slices/build';

// Define constants for buildables
const SIZES = {
    trench: [4, 2] as Vec2,
    wire: [4, 1] as Vec2,
    depot: [5, 5] as Vec2,
    workshop: [4, 4] as Vec2,
    barracks: [6, 4] as Vec2,
};
const COSTS = {
    trench: 10,
    wire: 5,
    depot: 100,
    workshop: 150,
    barracks: 80,
};

// Helper to check if two AABBs overlap
function checkAABBOverlap(posA: Vec2, sizeA: Vec2, posB: Vec2, sizeB: Vec2): boolean {
    const aMinX = posA[0] - sizeA[0] / 2;
    const aMaxX = posA[0] + sizeA[0] / 2;
    const aMinY = posA[1] - sizeA[1] / 2;
    const aMaxY = posA[1] + sizeA[1] / 2;

    const bMinX = posB[0] - sizeB[0] / 2;
    const bMaxX = posB[0] + sizeB[0] / 2;
    const bMinY = posB[1] - sizeB[1] / 2;
    const bMaxY = posB[1] + sizeB[1] / 2;

    if (aMaxX < bMinX || aMinX > bMaxX || aMaxY < bMinY || aMinY > bMaxY) {
        return false;
    }
    return true;
}

export const buildSystem = {
    getCost: (type: keyof typeof COSTS): number => {
        return COSTS[type] || Infinity;
    },

    getSize: (type: keyof typeof SIZES): Vec2 => {
        return SIZES[type] || [0, 0];
    },

    validatePlacement: (newBuildingPos: Vec2, type: BuildMode, existingBuildings: Buildable[]): boolean => {
        if (type === 'none') return false;
        if (type === 'trench') {
            return true;
        }

        const newBuildingSize = buildSystem.getSize(type);

        for (const building of existingBuildings) {
            const existingKind = building.kind.toLowerCase() as keyof typeof SIZES;
            const existingSize = buildSystem.getSize(existingKind);
            if (checkAABBOverlap(newBuildingPos, newBuildingSize, building.cells[0], existingSize)) {
                return false; // Overlap detected
            }
        }
        return true;
    }
};
