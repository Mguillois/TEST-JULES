import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../../State/store';

const NUM_PARTICLES = 2000;
const RAIN_AREA_SIZE = 120; // Match world width
const RAIN_HEIGHT = 50;

interface RainParticle {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
}

function Rain() {
    const meshRef = useRef<THREE.InstancedMesh>(null!);
    const isRaining = useStore(state => state.isRaining);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const particles = useMemo<RainParticle[]>(() => {
        const temp: RainParticle[] = [];
        for (let i = 0; i < NUM_PARTICLES; i++) {
            temp.push({
                position: new THREE.Vector3(
                    (Math.random() - 0.5) * RAIN_AREA_SIZE,
                    Math.random() * RAIN_HEIGHT,
                    (Math.random() - 0.5) * 80
                ),
                velocity: new THREE.Vector3(0, -30 - Math.random() * 20, 0),
            });
        }
        return temp;
    }, []);

    useFrame((_state, dt) => {
        if (!meshRef.current || !isRaining) return;

        particles.forEach((p, i) => {
            p.position.addScaledVector(p.velocity, dt);
            if (p.position.y < 0) {
                p.position.y = RAIN_HEIGHT;
            }

            dummy.position.copy(p.position);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    if (!isRaining) return null;

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, NUM_PARTICLES]}>
            <boxGeometry args={[0.02, 0.5, 0.02]} />
            <meshBasicMaterial color="#C0C0C0" transparent opacity={0.3} />
        </instancedMesh>
    );
}

export default Rain;
