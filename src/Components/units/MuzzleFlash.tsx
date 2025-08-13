import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../../State/store';
import { Vec2 } from '../../Core/Types';

const MAX_FLASHES = 100;
const flashSelector = (state: { muzzleFlashes: Vec2[] }) => state.muzzleFlashes;

// A reusable Object3D for calculations
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

      // Position the flash at the soldier's location, slightly in front and up
      dummy.position.set(flashPos[0], 0.8, flashPos[1] + 0.5);

      // Give it a random rotation and scale for variety
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const scale = 0.5 + Math.random() * 0.5;
      dummy.scale.set(scale, scale, scale);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(count++, dummy.matrix);
    }

    meshRef.current.count = count;
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, MAX_FLASHES]}>
      {/* Using a simple sphere for the flash */}
      <sphereGeometry args={[0.2, 8, 8]} />
      <meshBasicMaterial color="#FFA500" emissive="#FFA500" emissiveIntensity={3} />
    </instancedMesh>
  );
}

export default MuzzleFlash;
