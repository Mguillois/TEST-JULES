import * as THREE from 'three';
import { Buildable } from '../../Core/Types';
import { buildSystem } from '../../Systems/BuildSystem';

interface BarracksProps {
  building: Buildable;
}

const material = new THREE.MeshStandardMaterial({ color: '#556B2F' }); // Dark olive green

/**
 * Renders a Barracks building.
 */
function Barracks({ building }: BarracksProps) {
  const size = buildSystem.getSize('barracks');
  const position: [number, number, number] = [building.cells[0][0], 1, building.cells[0][1]];

  return (
    <mesh position={position} material={material} castShadow>
      <boxGeometry args={[size[0], 2, size[1]]} />
    </mesh>
  );
}

export default Barracks;
