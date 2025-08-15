import { useStore } from '../../State/store';
import * as THREE from 'three';

const validMaterial = new THREE.MeshBasicMaterial({ color: 'green', transparent: true, opacity: 0.5 });
const invalidMaterial = new THREE.MeshBasicMaterial({ color: 'red', transparent: true, opacity: 0.5 });

/**
 * Renders a ghost preview of the structure being placed.
 * The color indicates whether the current placement is valid.
 */
function GhostPreview() {
    const { buildMode, ghostPosition, isGhostPlacementValid } = useStore(state => ({
        buildMode: state.buildMode,
        ghostPosition: state.ghostPosition,
        isGhostPlacementValid: state.isGhostPlacementValid,
    }));

    if (buildMode === 'none' || !ghostPosition) {
        return null;
    }

    // For now, all buildables are trenches with a fixed size
    const size: [number, number, number] = [4, 1, 2]; // width, height, depth
    const position: [number, number, number] = [ghostPosition[0], 0.5, ghostPosition[1]];

    return (
        <mesh position={position} material={isGhostPlacementValid ? validMaterial : invalidMaterial}>
            <boxGeometry args={size} />
        </mesh>
    );
}

export default GhostPreview;
