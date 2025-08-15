import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Explosion as ExplosionType } from '../../Systems/ProjectileSystem';

const DURATION = 0.5; // seconds

function Explosion({ explosion }: { explosion: ExplosionType }) {
    const ref = useRef<THREE.Mesh>(null!);

    useFrame((_state, dt) => {
        if (!ref.current) return;

        const life = (ref.current.userData.life || 0) + dt;
        ref.current.userData.life = life;

        const progress = life / DURATION;

        if (progress > 1) {
            ref.current.visible = false;
            return;
        }

        // Animate scale and opacity
        const scale = progress * explosion.radius;
        ref.current.scale.set(scale, scale, scale);
        (ref.current.material as THREE.MeshStandardMaterial).opacity = 1 - progress;
    });

    return (
        <mesh ref={ref} position={explosion.position}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial
                color="#FFA500"
                emissive="#FF4500"
                emissiveIntensity={4}
                transparent
                opacity={1}
            />
        </mesh>
    );
}

export default Explosion;
