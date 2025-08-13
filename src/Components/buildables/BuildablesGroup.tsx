import { useStore } from '../../State/store';
import { AppState } from '../../State/store';
import TrenchSegment from './TrenchSegment';

const buildingsSelector = (state: AppState) => state.buildings;

/**
 * A component that renders all placed buildable structures.
 */
function BuildablesGroup() {
  const buildings = useStore(buildingsSelector);

  return (
    <group name="buildables">
      {buildings.map((building) => {
        switch (building.kind) {
          case 'Trench':
            return <TrenchSegment key={building.id} building={building} />;
          // Other building types will be added here later
          default:
            return null;
        }
      })}
    </group>
  );
}

export default BuildablesGroup;
