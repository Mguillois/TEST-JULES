import { StateCreator } from 'zustand';
import { Frameloop } from '@react-three/fiber';

export interface PerfSlice {
  /**
   * Controls the rendering loop of the R3F Canvas.
   * 'always' - renders every frame.
   * 'demand' - renders only on state change or explicit invalidation.
   * 'never' - stops rendering.
   */
  frameloop: Frameloop;
  actions: {
    setFrameloop: (frameloop: Frameloop) => void;
  };
}

export const createPerfSlice: StateCreator<PerfSlice, [], [], PerfSlice> = (set) => ({
  frameloop: 'always',
  actions: {
    setFrameloop: (frameloop) => set({ frameloop }),
  },
});
