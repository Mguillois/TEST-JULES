import type { StateCreator } from 'zustand';
import type { Economy } from '../../Core/Types';

export interface EconomySlice extends Economy {
  actions: {
    spendAmmo: (amount: number) => void;
    spendMaterials: (amount: number) => void;
    spendManpower: (amount: number) => void;
    addResources: (resources: Partial<Pick<Economy, 'ammo' | 'materials' | 'manpower'>>) => void;
  };
}

export const createEconomySlice: StateCreator<EconomySlice, [], [], EconomySlice> = (set) => ({
  ammo: 2000,
  materials: 1000,
  manpower: 50,
  actions: {
    spendAmmo: (amount) => set((state) => ({ ammo: Math.max(0, state.ammo - amount) })),
    spendMaterials: (amount) => set((state) => ({ materials: Math.max(0, state.materials - amount) })),
    spendManpower: (amount) => set((state) => ({ manpower: Math.max(0, state.manpower - amount) })),
    addResources: (resources) => set((state) => ({
        ammo: state.ammo + (resources.ammo || 0),
        materials: state.materials + (resources.materials || 0),
        manpower: state.manpower + (resources.manpower || 0),
    })),
  }
});
