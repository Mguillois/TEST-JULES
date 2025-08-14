import * as THREE from 'three';
import { Enemy as EnemyType } from '../../Core/Types';

interface EnemyProps {
  enemy: EnemyType;
}

const bodyMaterial = new THREE.MeshStandardMaterial({ color: '#B22222' }); // Firebrick Red
const rifleMaterial = new THREE.MeshStandardMaterial({ color: '#5C4033' }); // Dark brown

/**
 * Renders a single enemy unit with a procedural model.
 */
function Enemy({ enemy }: EnemyProps) {
  const position: [number, number, number] = [enemy.pos[0], 0, enemy.pos[1]];

  return (
    <group position={position}>
        {/* Body */}
        <mesh castShadow position={[0, 0.4, 0]} material={bodyMaterial}>
            <capsuleGeometry args={[0.3, 0.5, 4, 8]} />
        </mesh>
        {/* Head */}
        <mesh castShadow position={[0, 1.1, 0]} material={bodyMaterial}>
            <sphereGeometry args={[0.2, 16, 16]} />
        </mesh>
        {/* Rifle */}
        <mesh castShadow position={[0, 0.7, 0.3]} material={rifleMaterial}>
            <boxGeometry args={[0.1, 0.1, 0.8]} />
        </mesh>
    </group>
  );
}

export default Enemy;
