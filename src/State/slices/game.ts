import { StateCreator } from 'zustand';

export interface GameSlice {
  gameState: 'MainMenu' | 'Playing' | 'Paused' | 'GameOver';
  isResearchPanelOpen: boolean;
  wave: number;
  score: number;
  time: number;
  actions: {
    startGame: () => void;
    pauseGame: () => void;
    resumeGame: () => void;
    endGame: () => void;
    toggleResearchPanel: () => void;
  };
}

export const createGameSlice: StateCreator<GameSlice, [], [], GameSlice> = (set) => ({
  gameState: 'Playing', // Default to 'Playing' for development
  isResearchPanelOpen: false,
  wave: 0,
  score: 0,
  time: 0,
  actions: {
    startGame: () => set({ gameState: 'Playing', wave: 1, score: 0, time: 0 }),
    pauseGame: () => set((state) => (state.gameState === 'Playing' ? { gameState: 'Paused' } : state)),
    resumeGame: () => set((state) => (state.gameState === 'Paused' ? { gameState: 'Playing' } : state)),
    endGame: () => set({ gameState: 'GameOver' }),
    toggleResearchPanel: () => set((state) => ({ isResearchPanelOpen: !state.isResearchPanelOpen })),
  },
});
