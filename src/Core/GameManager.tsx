import { useFrame } from '@react-three/fiber';
import { tick } from './GameLoop';

/**
 * This component is the engine of the game. It plugs the game loop (`tick` function)
 * into the R3F render cycle. It doesn't render any visible elements.
 */
function GameManager() {
  useFrame((_state, delta) => {
    // Cap delta to prevent massive jumps in state if the tab is backgrounded
    // or if there's a large performance spike.
    const dt = Math.min(0.1, delta);

    tick(dt);
  });

  return null;
}

export default GameManager;
