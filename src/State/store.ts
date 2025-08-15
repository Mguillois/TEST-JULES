import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createGameSlice, type GameSlice } from './slices/game';
import { createWorldSlice, type WorldSlice } from './slices/world';
import { createUnitsSlice, type UnitsSlice } from './slices/units';
import { createBuildSlice, type BuildSlice } from './slices/build';
import { createPerfSlice, type PerfSlice } from './slices/perf';
import { createEconomySlice, type EconomySlice } from './slices/economy';
import { createResearchSlice, type ResearchSlice } from './slices/research';

export type AppState = GameSlice & WorldSlice & UnitsSlice & BuildSlice & PerfSlice & EconomySlice & ResearchSlice;

export const useStore = create<AppState>()(
  persist(
    (set, get, api) => ({
      ...createGameSlice(set, get, api),
      ...createWorldSlice(set, get, api),
      ...createUnitsSlice(set, get, api),
      ...createBuildSlice(set, get, api),
      ...createPerfSlice(set, get, api),
      ...createEconomySlice(set, get, api),
      ...createResearchSlice(set, get, api),
      actions: {
        ...createGameSlice(set, get, api).actions,
        ...createWorldSlice(set, get, api).actions,
        ...createUnitsSlice(set, get, api).actions,
        ...createBuildSlice(set, get, api).actions,
        ...createPerfSlice(set, get, api).actions,
        ...createEconomySlice(set, get, api).actions,
        ...createResearchSlice(set, get, api).actions,
      },
    }),
    {
      name: 'trench-forge-save',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        buildings: state.buildings,
        ammo: state.ammo,
        materials: state.materials,
        manpower: state.manpower,
        wave: state.wave,
        score: state.score,
        unlockedTechIds: state.unlockedTechIds,
        // Note: We are not saving transient state like selectedSoldierId, buildMode, etc.
      }),
    }
  )
);
