import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../../State/store';
import { Vec2 } from '../../Core/Types';

const MAX_PUFFS = 500;
const puffSelector = (state: { impactPuffs: Vec2[] }) => state.impactPuffs;

const dummy = new THREE.Object3D();

/**
 * Renders a pool of instanced impact puffs where projectiles hit the ground.
 */
function ImpactPuff() {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const puffs = useStore(puffSelector);

  // This effect is purely cosmetic and runs on the render thread.
  // It reads the puff positions from the state, which are set by the game loop.
  // The puffs themselves only last for one frame.
  useFrame(() => {
    if (!meshRef.current) return;

    let count = 0;
    for (const puffPos of puffs) {
      if (count >= MAX_PUFFS) break;

      dummy.position.set(puffPos[0], 0.1, puffPos[1]);

      const scale = 0.2 + Math.random() * 0.3;
      dummy.scale.set(scale, scale, scale);
      dummy.rotation.y = Math.random() * Math.PI * 2;

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(count++, dummy.matrix);
    }

    meshRef.current.count = count;
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, MAX_PUFFS]}>
      {/* Using an Icosahedron for a more 'poofy' shape than a sphere */}
      <icosahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial
        color="#8A795D"
        transparent
        opacity={0.5}
      />
    </instancedMesh>
  );
}

export default ImpactPuff;
