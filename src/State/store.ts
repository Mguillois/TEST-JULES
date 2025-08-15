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
    (set, get, api) => {
      const gameSlice = createGameSlice(set, get, api);
      const worldSlice = createWorldSlice(set, get, api);
      const unitsSlice = createUnitsSlice(set, get, api);
      const buildSlice = createBuildSlice(set, get, api);
      const perfSlice = createPerfSlice(set, get, api);
      const economySlice = createEconomySlice(set, get, api);
      const researchSlice = createResearchSlice(set, get, api);

      return {
        ...gameSlice,
        ...worldSlice,
        ...unitsSlice,
        ...buildSlice,
        ...perfSlice,
        ...economySlice,
        ...researchSlice,
        actions: {
          ...gameSlice.actions,
          ...worldSlice.actions,
          ...unitsSlice.actions,
          ...buildSlice.actions,
          ...perfSlice.actions,
          ...economySlice.actions,
          ...researchSlice.actions,
        },
      };
    },
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
