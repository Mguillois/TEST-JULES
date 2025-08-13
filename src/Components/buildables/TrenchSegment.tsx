import * as THREE from 'three';
import { Buildable } from '../../Core/Types';

interface TrenchSegmentProps {
  building: Buildable;
}

const trenchMaterial = new THREE.MeshStandardMaterial({ color: '#6B4F3A' }); // Brown, earthy color

/**
 * Renders a single trench segment.
 * For M1, this is a simple mesh that looks like a dug-out area.
 */
function TrenchSegment({ building }: TrenchSegmentProps) {
  // A trench segment is 4m long (x), 2m wide (z)
  const size: [number, number, number] = [4, 0.2, 2];
  // The position is the center of the trench, stored in the first cell.
  // We place it slightly below ground level to give a dug-out impression.
  const position: [number, number, number] = [building.cells[0][0], -0.1, building.cells[0][1]];

  return (
    <mesh position={position} material={trenchMaterial} receiveShadow>
      <boxGeometry args={size} />
    </mesh>
  );
}

export default TrenchSegment;
