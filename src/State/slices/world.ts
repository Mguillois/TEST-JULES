import { StateCreator } from 'zustand';
import { Vec2 } from '../../Core/Types';

export interface WorldSlice {
  dimensions: Vec2;
  terrain: number[][];
  isRaining: boolean;
  dirtyChunks: string[]; // Array of chunk keys, e.g., "x-z"
  chunkVersions: Record<string, number>; // Map from chunk key to version number
  actions: {
    digTrench: (center: Vec2, size: Vec2) => void;
    processDirtyChunk: () => void;
    setWeather: (isRaining: boolean) => void;
  };
}

const WORLD_WIDTH = 120;
const WORLD_DEPTH = 80;
export const CHUNK_SIZE = 16;

const initialTerrain: number[][] = Array(WORLD_WIDTH).fill(0).map(() => Array(WORLD_DEPTH).fill(0));

export const createWorldSlice: StateCreator<WorldSlice, [], [], WorldSlice> = (set, get) => ({
  dimensions: [WORLD_WIDTH, WORLD_DEPTH],
  terrain: initialTerrain,
  isRaining: false,
  dirtyChunks: [],
  chunkVersions: {},
  actions: {
    setWeather: (isRaining) => set({ isRaining }),
    digTrench: (center, size) => {
      const { terrain } = get();
      const newTerrain = terrain.map(arr => arr.slice()); // Deep copy
      const affectedChunks = new Set<string>();

      // The center position is in world coordinates. We need to iterate over world coordinates.
      const startX = Math.floor(center[0] - size[0] / 2);
      const endX = Math.floor(center[0] + size[0] / 2);
      const startZ = Math.floor(center[1] - size[1] / 2);
      const endZ = Math.floor(center[1] + size[1] / 2);

      for (let x = startX; x < endX; x++) {
        for (let z = startZ; z < endZ; z++) {
          // Convert world coordinates (x, z) to array indices (arrayX, arrayZ)
          const arrayX = Math.round(x + WORLD_WIDTH / 2);
          const arrayZ = Math.round(z + WORLD_DEPTH / 2);

          if (arrayX >= 0 && arrayX < WORLD_WIDTH && arrayZ >= 0 && arrayZ < WORLD_DEPTH) {
            newTerrain[arrayX][arrayZ] -= 1.8; // Dig down 1.8m
            const chunkX = Math.floor(arrayX / CHUNK_SIZE);
            const chunkZ = Math.floor(arrayZ / CHUNK_SIZE);
            affectedChunks.add(`${chunkX}-${chunkZ}`);
          }
        }
      }

      set(state => ({
        terrain: newTerrain,
        dirtyChunks: [...new Set([...state.dirtyChunks, ...affectedChunks])]
      }));
    },
    processDirtyChunk: () => {
      const { dirtyChunks, chunkVersions } = get();
      if (dirtyChunks.length > 0) {
        const chunkKey = dirtyChunks[0];
        const newVersions = { ...chunkVersions, [chunkKey]: (chunkVersions[chunkKey] || 0) + 1 };
        const newDirtyChunks = dirtyChunks.slice(1);
        set({ dirtyChunks: newDirtyChunks, chunkVersions: newVersions });
      }
    },
  },
});
