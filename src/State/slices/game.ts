import type { StateCreator } from 'zustand';

export interface GameSlice {
  gameState: 'MainMenu' | 'Playing' | 'Paused' | 'GameOver';
  isResearchPanelOpen: boolean;
  targetingMode: { active: boolean; fromBuildingId: string | null };
  wave: number;
  score: number;
  time: number;
  actions: {
    startGame: () => void;
    pauseGame: () => void;
    resumeGame: () => void;
    endGame: () => void;
    toggleResearchPanel: () => void;
    setTargetingMode: (active: boolean, fromBuildingId?: string) => void;
  };
}

export const createGameSlice: StateCreator<GameSlice, [], [], GameSlice> = (set) => ({
  gameState: 'Playing', // Default to 'Playing' for development
  isResearchPanelOpen: false,
  targetingMode: { active: false, fromBuildingId: null },
  wave: 0,
  score: 0,
  time: 0,
  actions: {
    startGame: () => set({ gameState: 'Playing', wave: 1, score: 0, time: 0 }),
    pauseGame: () => set((state) => (state.gameState === 'Playing' ? { gameState: 'Paused' } : state)),
    resumeGame: () => set((state) => (state.gameState === 'Paused' ? { gameState: 'Playing' } : state)),
    endGame: () => set({ gameState: 'GameOver' }),
    toggleResearchPanel: () => set((state) => ({ isResearchPanelOpen: !state.isResearchPanelOpen })),
    setTargetingMode: (active, fromBuildingId) =>
      set((s) =>
        s.targetingMode.active === active
          ? s
          : { targetingMode: { active, fromBuildingId: fromBuildingId || null } }
      ),
  },
});
