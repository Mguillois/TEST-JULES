import { create } from 'zustand';
import { createGameSlice, GameSlice } from './slices/game';
import { createWorldSlice, WorldSlice } from './slices/world';
import { createUnitsSlice, UnitsSlice } from './slices/units';
import { createBuildSlice, BuildSlice } from './slices/build';
import { createPerfSlice, PerfSlice } from './slices/perf';

// The combined state of all slices
export type AppState = GameSlice & WorldSlice & UnitsSlice & BuildSlice & PerfSlice;

/**
 * The main Zustand store for the application.
 * It combines all the individual state slices into a single store.
 *
 * The `(...a)` syntax is a standard pattern for composing slices in Zustand.
 * It passes the `set`, `get`, and `api` arguments to each slice creator.
 */
export const useStore = create<AppState>()((...a) => ({
  ...createGameSlice(...a),
  ...createWorldSlice(...a),
  ...createUnitsSlice(...a),
  ...createBuildSlice(...a),
  ...createPerfSlice(...a),
}));
