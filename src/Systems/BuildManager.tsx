import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { useStore } from '../State/store';
import { buildSystem } from '../Systems/BuildSystem';
import * as THREE from 'three';
import { v4 as uuidv4 } from 'uuid';
import { BuildMode } from '../State/slices/build';

const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const groundRaycaster = new THREE.Raycaster();

function BuildManager() {
  const { buildMode, buildings, materials, actions } = useStore(state => ({
    buildMode: state.buildMode,
    buildings: state.buildings,
    materials: state.materials,
    actions: state.actions,
  }));
  const { camera } = useThree();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMap: Record<string, BuildMode> = {
        'b': 'trench',
        'c': 'wire',
        '5': 'depot',
        '6': 'workshop',
        '7': 'barracks',
      };
      const newMode = keyMap[e.key.toLowerCase()];
      if (newMode) {
        actions.setBuildMode(buildMode === newMode ? 'none' : newMode);
      }
      if (e.key === 'Escape') {
        actions.setBuildMode('none');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [buildMode, actions]);

  const handlePointerMove = (e: PointerEvent) => {
    const currentBuildMode = useStore.getState().buildMode;
    if (currentBuildMode === 'none') {
        if (useStore.getState().ghostPosition !== null) actions.setGhostState(null, false);
        return;
    }

    const pointer = new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    groundRaycaster.setFromCamera(pointer, camera);
    const intersection = new THREE.Vector3();
    if (groundRaycaster.ray.intersectPlane(groundPlane, intersection)) {
        const snappedPos: [number, number] = [Math.round(intersection.x), Math.round(intersection.z)];
        const isValid = buildSystem.validatePlacement(snappedPos, currentBuildMode, useStore.getState().buildings);
        actions.setGhostState(snappedPos, isValid);
    }
  };

  const handlePointerDown = () => {
      const { buildMode, ghostPosition, isGhostPlacementValid, materials, actions } = useStore.getState();
      if (buildMode === 'none' || !isGhostPlacementValid || !ghostPosition) return;

      const cost = buildSystem.getCost(buildMode);
      if (materials < cost) return;

      if (buildMode === 'trench') {
          actions.digTrench(ghostPosition, buildSystem.getSize('trench'));
          actions.spendMaterials(cost);
      } else {
          // Handle all other buildable objects
          const kind = (buildMode.charAt(0).toUpperCase() + buildMode.slice(1)) as 'BarbedWire' | 'Depot' | 'Workshop' | 'Barracks';
          actions.addBuilding({
              id: uuidv4(),
              kind: kind,
              cells: [ghostPosition],
              hp: 100, // Placeholder HP
              level: 1,
          });
          actions.spendMaterials(cost);
      }
  };

  const gl = useThree(state => state.gl);
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerdown', handlePointerDown);
    return () => {
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [gl, buildMode]);

  return null;
}

export default BuildManager;
