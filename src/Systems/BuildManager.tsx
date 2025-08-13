import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { useStore } from '../State/store';
import { buildSystem } from '../Systems/BuildSystem';
import * as THREE from 'three';
import { v4 as uuidv4 } from 'uuid';

// This is the invisible plane that the mouse will intersect with to find the build position.
const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const groundRaycaster = new THREE.Raycaster();

/**
 * A controller component that manages the building workflow.
 * It handles keyboard input, mouse movement for ghost placement, and clicks to build.
 */
function BuildManager() {
  const { setBuildMode, setGhostState, addBuilding, buildMode, buildings, materials, spendMaterials } = useStore(state => ({
    setBuildMode: state.actions.setBuildMode,
    setGhostState: state.actions.setGhostState,
    addBuilding: state.actions.addBuilding,
    buildMode: state.buildMode,
    buildings: state.buildings,
    materials: state.materials,
    spendMaterials: state.actions.spendMaterials,
  }));
  const { camera, scene } = useThree();

  // Effect for keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'b' || e.key === 'B') {
        setBuildMode(buildMode === 'trench' ? 'none' : 'trench');
      }
      if (e.key === 'Escape') {
        setBuildMode('none');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [buildMode, setBuildMode]);

  const handlePointerMove = (e: PointerEvent) => {
    if (buildMode === 'none') {
        setGhostState(null, false);
        return;
    }

    const pointer = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
    );

    groundRaycaster.setFromCamera(pointer, camera);
    const intersection = new THREE.Vector3();
    groundRaycaster.ray.intersectPlane(groundPlane, intersection);

    // Snap to 1m grid
    const snappedPos: [number, number] = [Math.round(intersection.x), Math.round(intersection.z)];
    const isValid = buildSystem.validatePlacement(snappedPos, buildings);
    setGhostState(snappedPos, isValid);
  };

  const handlePointerDown = () => {
      if (buildMode === 'trench') {
          const { ghostPosition, isGhostPlacementValid } = useStore.getState();
          const cost = buildSystem.getCost('trench');
          if (isGhostPlacementValid && ghostPosition && materials >= cost) {
              addBuilding({
                  id: uuidv4(),
                  kind: 'Trench',
                  cells: [ghostPosition],
                  hp: 500,
                  level: 1,
              });
              spendMaterials(cost);
          }
      }
  };

  // Add event listeners to the canvas
  const gl = useThree(state => state.gl);
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerdown', handlePointerDown);
    return () => {
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [gl, buildMode, buildings, materials]); // Re-bind if state affecting callbacks changes

  return null;
}

export default BuildManager;
