import { StateCreator } from 'zustand';
import { TechId } from '../../Core/Types';

export interface ResearchSlice {
  unlockedTechIds: TechId[];
  actions: {
    unlockTech: (techId: TechId) => void;
  };
}

export const createResearchSlice: StateCreator<ResearchSlice, [], [], ResearchSlice> = (set) => ({
  unlockedTechIds: [],
  actions: {
    unlockTech: (techId) => {
      set((state) => ({
        unlockedTechIds: [...state.unlockedTechIds, techId],
      }));
    },
  },
});
