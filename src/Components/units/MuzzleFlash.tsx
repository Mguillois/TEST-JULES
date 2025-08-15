import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../../State/store';
import type { Vec2 } from '../../Core/Types';

const MAX_FLASHES = 100;
const flashSelector = (state: { muzzleFlashes: Vec2[] }) => state.muzzleFlashes;

const dummy = new THREE.Object3D();

/**
 * Renders a pool of instanced muzzle flashes.
 */
function MuzzleFlash() {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const flashes = useStore(flashSelector);

  useFrame(() => {
    if (!meshRef.current) return;

    let count = 0;
    for (const flashPos of flashes) {
      if (count >= MAX_FLASHES) break;

      dummy.position.set(flashPos[0], 0.8, flashPos[1] + 0.5);

      const scale = 0.5 + Math.random() * 0.5;
      dummy.scale.set(scale, scale, scale);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(count++, dummy.matrix);
    }

    meshRef.current.count = count;
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, MAX_FLASHES]}>
      <sphereGeometry args={[0.2, 8, 8]} />
      <meshStandardMaterial color="#FFA500" emissive="#FFA500" emissiveIntensity={3} />
    </instancedMesh>
  );
}

export default MuzzleFlash;
