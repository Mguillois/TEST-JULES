import { useEffect } from 'react';
import { useStore } from '../State/store';
import { gameState } from '../State/game-state';
import { useThree } from '@react-three/fiber';

const UPDATE_INTERVAL = 1000 / 30; // 30 FPS

function StateBridge() {
  const invalidate = useThree(state => state.invalidate);
  const processDirtyChunk = useStore(state => state.actions.processDirtyChunk);

  useEffect(() => {
    let lastUpdateTime = 0;

    const unsubscribe = gameState.subscribe(
      (state) => {
        const now = performance.now();
        if (now - lastUpdateTime < UPDATE_INTERVAL) {
          return;
        }
        lastUpdateTime = now;

        useStore.setState(state);
        processDirtyChunk();

        // Manually invalidate to trigger a re-render, as we are outside of the normal React update cycle.
        invalidate();
      }
    );

    return () => {
      unsubscribe();
    };
  }, [invalidate, processDirtyChunk]);

  return null;
}

export default StateBridge;
