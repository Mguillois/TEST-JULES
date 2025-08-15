import * as THREE from 'three';
import type { Buildable } from '../../Core/Types';

interface BarbedWireProps {
  building: Buildable;
}

const wireMaterial = new THREE.MeshStandardMaterial({
    color: '#8B8B83', // A metallic grey
    roughness: 0.8,
    metalness: 0.5,
});

/**
 * Renders a single barbed wire entanglement.
 * For M1, this is a simple mesh.
 */
function BarbedWire({ building }: BarbedWireProps) {
  // A wire segment is 4m long (x), 1m wide (z)
  const size: [number, number, number] = [4, 0.5, 1];
  const position: [number, number, number] = [building.cells[0][0], 0.25, building.cells[0][1]];

  return (
    <mesh position={position} material={wireMaterial} castShadow>
      <boxGeometry args={size} />
    </mesh>
  );
}

export default BarbedWire;
