import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const NUM_PARTICLES = 50;

interface SmokeParticle {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    life: number;
    maxLife: number;
}

function SmokeEmitter({ position }: { position: THREE.Vector3 }) {
    const meshRef = useRef<THREE.InstancedMesh>(null!);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const particles = useMemo<SmokeParticle[]>(() => {
        const temp: SmokeParticle[] = [];
        for (let i = 0; i < NUM_PARTICLES; i++) {
            temp.push({
                position: new THREE.Vector3(
                    position.x + (Math.random() - 0.5) * 2,
                    position.y + Math.random() * 2,
                    position.z + (Math.random() - 0.5) * 2
                ),
                velocity: new THREE.Vector3(0, 0.5 + Math.random() * 0.5, 0),
                life: Math.random() * 5,
                maxLife: 5 + Math.random() * 5,
            });
        }
        return temp;
    }, [position]);

    useFrame((_state, dt) => {
        if (!meshRef.current) return;

        particles.forEach((p, i) => {
            p.life += dt;
            if (p.life > p.maxLife) {
                p.life = 0;
                p.position.set(
                    position.x + (Math.random() - 0.5) * 2,
                    position.y,
                    position.z + (Math.random() - 0.5) * 2
                );
            }
            p.position.addScaledVector(p.velocity, dt);

            dummy.position.copy(p.position);
            const scale = 1 - (p.life / p.maxLife); // Fade out by scaling down
            dummy.scale.set(scale, scale, scale);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, NUM_PARTICLES]}>
            <sphereGeometry args={[0.5, 8, 8]} />
            <meshStandardMaterial
                color="#FFFFFF"
                transparent
                opacity={0.1}
                depthWrite={false} // Important for transparency
            />
        </instancedMesh>
    );
}

export default SmokeEmitter;
