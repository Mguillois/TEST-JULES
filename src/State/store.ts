import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createGameSlice, GameSlice } from './slices/game';
import { createWorldSlice, WorldSlice } from './slices/world';
import { createUnitsSlice, UnitsSlice } from './slices/units';
import { createBuildSlice, BuildSlice } from './slices/build';
import { createPerfSlice, PerfSlice } from './slices/perf';
import { createEconomySlice, EconomySlice } from './slices/economy';
import { createResearchSlice, ResearchSlice } from './slices/research';

// The combined state of all slices
export type AppState = GameSlice & WorldSlice & UnitsSlice & BuildSlice & PerfSlice & EconomySlice & ResearchSlice;

/**
 * The main Zustand store for the application.
 * It combines all the individual state slices into a single store.
 * It also uses the `persist` middleware to save parts of the state to localStorage.
 */
export const useStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createGameSlice(...a),
      ...createWorldSlice(...a),
      ...createUnitsSlice(...a),
      ...createBuildSlice(...a),
      ...createPerfSlice(...a),
      ...createEconomySlice(...a),
  ...createResearchSlice(...a),
    }),
    {
      name: 'trench-forge-save', // name of the item in the storage
      storage: createJSONStorage(() => localStorage),
      // Only persist a subset of the state
      partialize: (state) => ({
        buildings: state.buildings,
        ammo: state.ammo,
        materials: state.materials,
        manpower: state.manpower,
        wave: state.wave,
        score: state.score,
      }),
      // This function is called when the storage is rehydrated
      onRehydrateStorage: (state) => {
        console.log('Hydrated from storage. Welcome back!');
        // We can return a function to be called after rehydration completes
        return (state, error) => {
          if (error) {
            console.error('An error occurred during rehydration:', error);
          } else {
            // Set buildMode to 'none' on load, regardless of saved state
            state?.actions.setBuildMode('none');
          }
        };
      },
    }
  )
);
