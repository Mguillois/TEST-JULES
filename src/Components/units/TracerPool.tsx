import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../../State/store';
import type { Projectile } from '../../Core/Types';

const MAX_TRACERS = 500;
const tracerSelector = (state: { projectiles: Projectile[] }) => state.projectiles.filter(p => p.tracer);

const dummy = new THREE.Object3D();

/**
 * Renders a pool of instanced tracers for projectiles in 3D space.
 */
function TracerPool() {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const tracers = useStore(tracerSelector);

  useFrame((_state, dt) => {
    if (!meshRef.current) return;

    let count = 0;
    for (const tracer of tracers) {
      if (count >= MAX_TRACERS) break;

      const end = new THREE.Vector3(...tracer.pos);
      const start = new THREE.Vector3(
        tracer.pos[0] - tracer.vel[0] * dt,
        tracer.pos[1] - tracer.vel[1] * dt,
        tracer.pos[2] - tracer.vel[2] * dt
      );

      const length = start.distanceTo(end);
      if (length < 0.01) continue;

      dummy.position.copy(start).lerp(end, 0.5);
      dummy.scale.set(1, 1, length); // The box is 1 unit long on Z
      dummy.lookAt(end);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(count++, dummy.matrix);
    }

    meshRef.current.count = count;
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, MAX_TRACERS]}>
      <boxGeometry args={[0.05, 0.05, 1]} />
      <meshStandardMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={2} />
    </instancedMesh>
  );
}

export default TracerPool;
