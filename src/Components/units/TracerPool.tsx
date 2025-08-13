import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../../State/store';
import { Projectile } from '../../Core/Types';

const MAX_TRACERS = 500;
const tracerSelector = (state: { projectiles: Projectile[] }) => state.projectiles.filter(p => p.tracer);

// A reusable Object3D for calculations to avoid creating new objects in the loop
const dummy = new THREE.Object3D();

/**
 * Renders a pool of instanced tracers for projectiles.
 */
function TracerPool() {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const tracers = useStore(tracerSelector);

  useFrame((_state, dt) => {
    if (!meshRef.current) return;

    let count = 0;
    for (const tracer of tracers) {
      if (count >= MAX_TRACERS) break;

      // Calculate the start and end points of the tracer line for this frame
      const end = new THREE.Vector3(tracer.pos[0], 0.5, tracer.pos[1]);
      const start = new THREE.Vector3(
        tracer.pos[0] - tracer.vel[0] * dt,
        0.5,
        tracer.pos[1] - tracer.vel[1] * dt
      );

      const length = start.distanceTo(end);
      if (length < 0.01) continue; // Don't render zero-length tracers

      // Position the dummy object at the center of the line segment
      dummy.position.copy(start).lerp(end, 0.5);

      // Scale the dummy along its Z-axis to match the length of the tracer
      dummy.scale.set(1, 1, length);

      // Orient the dummy to point from the start to the end
      dummy.lookAt(end);

      // Apply the transformation matrix to the instance
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(count++, dummy.matrix);
    }

    // Update the instance count and notify Three.js that the instance matrix has changed
    meshRef.current.count = count;
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, MAX_TRACERS]}>
      {/* A thin, long box geometry oriented along the Z-axis */}
      <boxGeometry args={[0.05, 0.05, 1]} />
      <meshBasicMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={2} />
    </instancedMesh>
  );
}

export default TracerPool;
