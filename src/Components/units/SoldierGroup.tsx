import { useStore } from '../../State/store';
import { AppState } from '../../State/store';
import Soldier from './Soldier';

// A selector that memoizes the soldiers array.
// This prevents the component from re-rendering if other parts of the state change.
const soldiersSelector = (state: AppState) => state.soldiers;

/**
 * A component that renders all player soldiers from the game state.
 */
function SoldierGroup() {
  const soldiers = useStore(soldiersSelector);

  return (
    <group name="player-soldiers">
      {soldiers.map((soldier) => (
        <Soldier key={soldier.id} soldier={soldier} />
      ))}
    </group>
  );
}

export default SoldierGroup;
