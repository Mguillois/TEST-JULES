import * as THREE from 'three';
import type { Buildable } from '../../Core/Types';
import { buildSystem } from '../../Systems/BuildSystem';

interface MortarPitProps {
  building: Buildable;
}

const pitMaterial = new THREE.MeshStandardMaterial({ color: '#C0C0C0' }); // Silver for the mortar
const baseMaterial = new THREE.MeshStandardMaterial({ color: '#A9A9A9' }); // Dark grey for the base

/**
 * Renders a Mortar Pit building.
 */
function MortarPit({ building }: MortarPitProps) {
  const size = buildSystem.getSize('mortar_pit');
  const position: [number, number, number] = [building.cells[0][0], 0, building.cells[0][1]];

  return (
    <group position={position}>
        {/* Base */}
        <mesh material={baseMaterial} castShadow receiveShadow position={[0, 0.1, 0]}>
            <boxGeometry args={[size[0], 0.2, size[1]]} />
        </mesh>
        {/* Mortar Tube */}
        <mesh material={pitMaterial} castShadow position={[0, 0.6, 0]} rotation={[-Math.PI / 4, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 1, 8]} />
        </mesh>
    </group>
  );
}

export default MortarPit;
