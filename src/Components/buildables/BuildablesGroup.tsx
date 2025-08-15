import { useStore } from '../../State/store';
import type { AppState } from '../../State/store';
import BarbedWire from './BarbedWire';
import Depot from './Depot';
import Workshop from './Workshop';
import Barracks from './Barracks';
import MortarPit from './MortarPit';

const buildingsSelector = (state: AppState) => state.buildings;

/**
 * A component that renders all placed buildable structures (not trenches).
 */
function BuildablesGroup() {
  const buildings = useStore(buildingsSelector);

  return (
    <group name="buildables">
      {buildings.map((building) => {
        switch (building.kind) {
          case 'BarbedWire':
            return <BarbedWire key={building.id} building={building} />;
          case 'Depot':
            return <Depot key={building.id} building={building} />;
          case 'Workshop':
            return <Workshop key={building.id} building={building} />;
          case 'Barracks':
            return <Barracks key={building.id} building={building} />;
          case 'MortarPit':
            return <MortarPit key={building.id} building={building} />;
          default:
            return null;
        }
      })}
    </group>
  );
}

export default BuildablesGroup;
