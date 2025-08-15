import * as THREE from 'three';
import type { Buildable } from '../../Core/Types';
import { buildSystem } from '../../Systems/BuildSystem';

interface DepotProps {
  building: Buildable;
}

const material = new THREE.MeshStandardMaterial({ color: '#A0A0A0' }); // Light grey concrete

/**
 * Renders a Depot building.
 */
function Depot({ building }: DepotProps) {
  const size = buildSystem.getSize('depot');
  const position: [number, number, number] = [building.cells[0][0], 1, building.cells[0][1]];

  return (
    <mesh position={position} material={material} castShadow>
      <boxGeometry args={[size[0], 2, size[1]]} />
    </mesh>
  );
}

export default Depot;
