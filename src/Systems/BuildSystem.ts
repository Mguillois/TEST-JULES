import { Buildable, Vec2 } from '../Core/Types';

const TRENCH_COST = 10; // materials
const TRENCH_SIZE: Vec2 = [4, 2]; // A trench segment is 4m long, 2m wide

// Helper to check if two AABBs overlap
function checkAABBOverlap(posA: Vec2, sizeA: Vec2, posB: Vec2, sizeB: Vec2): boolean {
    // AABB 1
    const aMinX = posA[0] - sizeA[0] / 2;
    const aMaxX = posA[0] + sizeA[0] / 2;
    const aMinY = posA[1] - sizeA[1] / 2;
    const aMaxY = posA[1] + sizeA[1] / 2;

    // AABB 2
    const bMinX = posB[0] - sizeB[0] / 2;
    const bMaxX = posB[0] + sizeB[0] / 2;
    const bMinY = posB[1] - sizeB[1] / 2;
    const bMaxY = posB[1] + sizeB[1] / 2;

    // Check for non-overlap
    if (aMaxX < bMinX || aMinX > bMaxX || aMaxY < bMinY || aMinY > bMaxY) {
        return false;
    }
    return true;
}


/**
 * A collection of pure functions for the building system.
 */
export const buildSystem = {
    /**
     * Gets the material cost for a given buildable type.
     */
    getCost: (type: 'trench'): number => {
        switch (type) {
            case 'trench':
                return TRENCH_COST;
            default:
                return Infinity;
        }
    },

    /**
     * Validates if a new building can be placed at the desired position.
     * @param newBuildingPos The center position of the new building.
     * @param existingBuildings The array of already placed buildings.
     * @returns True if the placement is valid, false otherwise.
     */
    validatePlacement: (newBuildingPos: Vec2, existingBuildings: Buildable[]): boolean => {
        // For now, we only have trenches
        const newBuildingSize = TRENCH_SIZE;

        // Check for overlaps with existing buildings
        for (const building of existingBuildings) {
            // Assuming all buildings are trenches for now
            if (checkAABBOverlap(newBuildingPos, newBuildingSize, building.cells[0], TRENCH_SIZE)) {
                return false; // Overlap detected
            }
        }

        // TODO: Add bounds check against playfield size

        return true; // Placement is valid
    }
};
