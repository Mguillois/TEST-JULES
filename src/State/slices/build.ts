import { StateCreator } from 'zustand';
import { Buildable } from '../../Core/Types';

export interface BuildSlice {
  buildings: Buildable[];
  actions: {
    // Placeholder for actions related to building and upgrading structures.
  };
}

export const createBuildSlice: StateCreator<BuildSlice, [], [], BuildSlice> = () => ({
  buildings: [],
  actions: {},
});
