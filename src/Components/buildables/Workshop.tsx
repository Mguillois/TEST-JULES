import * as THREE from 'three';
import type { Buildable } from '../../Core/Types';
import { buildSystem } from '../../Systems/BuildSystem';

interface WorkshopProps {
  building: Buildable;
}

const material = new THREE.MeshStandardMaterial({ color: '#D2691E' }); // Chocolate brown for wood/brick

/**
 * Renders a Workshop building.
 */
function Workshop({ building }: WorkshopProps) {
  const size = buildSystem.getSize('workshop');
  const position: [number, number, number] = [building.cells[0][0], 1, building.cells[0][1]];

  return (
    <mesh position={position} material={material} castShadow>
      <boxGeometry args={[size[0], 2, size[1]]} />
    </mesh>
  );
}

export default Workshop;
