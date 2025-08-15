import { useStore } from '../../State/store';
import type { AppState } from '../../State/store';
import Enemy from './Enemy';

// A selector that memoizes the enemies array.
const enemiesSelector = (state: AppState) => state.enemies;

/**
 * A component that renders all enemy units from the game state.
 */
function EnemyGroup() {
  const enemies = useStore(enemiesSelector);

  return (
    <group name="enemies">
      {enemies.map((enemy) => (
        <Enemy key={enemy.id} enemy={enemy} />
      ))}
    </group>
  );
}

export default EnemyGroup;
