import type { StateCreator } from 'zustand';
import type { Vec2, Buildable } from '../../Core/Types';

export type BuildMode = 'none' | 'trench' | 'wire' | 'depot' | 'workshop' | 'barracks' | 'mortar_pit' | 'recruit_medic' | 'recruit_engineer';

export interface BuildSlice {
  buildings: Buildable[]; // For discrete objects like barbed wire, MG nests, etc.
  buildMode: BuildMode;
  ghostPosition: Vec2 | null;
  isGhostPlacementValid: boolean;
  actions: {
    setBuildMode: (mode: BuildMode) => void;
    setGhostState: (pos: Vec2 | null, isValid: boolean) => void;
    addBuilding: (building: Buildable) => void;
  };
}

export const createBuildSlice: StateCreator<BuildSlice, [], [], BuildSlice> = (set) => ({
  buildings: [],
  buildMode: 'none',
  ghostPosition: null,
  isGhostPlacementValid: false,
  actions: {
    setBuildMode: (mode) =>
      set((s) =>
        s.buildMode === mode
          ? s
          : { buildMode: mode, ghostPosition: null, isGhostPlacementValid: false }
      ),
    setGhostState: (pos, isValid) => {
      set({ ghostPosition: pos, isGhostPlacementValid: isValid });
    },
    addBuilding: (building) => {
      set((state) => ({ buildings: [...state.buildings, building] }));
    },
  },
});
