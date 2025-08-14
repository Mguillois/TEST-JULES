import { useStore } from '../../State/store';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

function TargetReticule() {
    const ref = useRef<THREE.Group>(null!);
    const { active, ghostPosition } = useStore(state => ({
        active: state.targetingMode.active,
        ghostPosition: state.ghostPosition, // We can reuse the ghost position from the build system
    }));

    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.y += 0.01;
            if (ghostPosition) {
                ref.current.position.set(ghostPosition[0], 0.1, ghostPosition[1]);
            }
        }
    });

    if (!active) return null;

    return (
        <group ref={ref}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[2.8, 3, 32]} />
                <meshBasicMaterial color="red" side={THREE.DoubleSide} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.9, 1, 32]} />
                <meshBasicMaterial color="red" side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
}

export default TargetReticule;
