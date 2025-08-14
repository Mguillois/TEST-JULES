import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { useStore } from '../State/store';
import { buildSystem } from '../Systems/BuildSystem';
import { mortarSystem } from './MortarSystem';
import * as THREE from 'three';
import { v4 as uuidv4 } from 'uuid';
import { BuildMode } from '../State/slices/build';
import { Soldier, SoldierClassId } from '../Core/Types';

const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const groundRaycaster = new THREE.Raycaster();

function InputManager() {
  const { buildMode, buildings, materials, manpower, targetingMode, actions } = useStore(state => ({
    buildMode: state.buildMode,
    buildings: state.buildings,
    materials: state.materials,
    manpower: state.manpower,
    targetingMode: state.targetingMode,
    actions: state.actions,
  }));
  const { camera } = useThree();

  const createNewSoldier = (classId: SoldierClassId): Soldier => {
    const xPos = (Math.random() - 0.5) * 40;
    return { id: uuidv4(), team: 'Player', pos: [xPos, 2], hp: 100, armor: 0.1, weapon: 'rifle', classId: classId, fireCooldown: 0, actionCooldown: 0, aimSpread: 0.1, suppressed: 0, xp: 0, moveTarget: null };
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const buildModeMap: Record<string, BuildMode> = { 'b': 'trench', 'c': 'wire', '5': 'depot', '6': 'workshop', '7': 'barracks', '0': 'mortar_pit' };
      const recruitMap: Record<string, SoldierClassId> = { '8': 'medic', '9': 'engineer' };

      const newBuildMode = buildModeMap[e.key.toLowerCase()];
      const newRecruitType = recruitMap[e.key.toLowerCase()];

      if (newBuildMode) {
        actions.setBuildMode(buildMode === newBuildMode ? 'none' : newBuildMode);
      } else if (newRecruitType) {
        const cost = buildSystem.getCost(`recruit_${newRecruitType}` as any);
        if (useStore.getState().manpower >= cost) {
            actions.spendManpower(cost);
            actions.addSoldier(createNewSoldier(newRecruitType));
        }
      } else if (e.key.toLowerCase() === 't') {
        const mortar = useStore.getState().buildings.find(b => b.kind === 'MortarPit');
        if (mortar) {
            actions.setTargetingMode(!targetingMode.active, mortar.id);
        } else {
            console.log("No mortar pit built!");
        }
      }

      if (e.key === 'Escape') {
          actions.setBuildMode('none');
          actions.setTargetingMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [buildMode, targetingMode, actions]);

  const handlePointerMove = (e: PointerEvent) => {
    const { buildMode, targetingMode } = useStore.getState();
    if (buildMode === 'none' && !targetingMode.active) {
        if (useStore.getState().ghostPosition !== null) actions.setGhostState(null, false);
        return;
    }

    const pointer = new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    groundRaycaster.setFromCamera(pointer, camera);
    const intersection = new THREE.Vector3();
    if (groundRaycaster.ray.intersectPlane(groundPlane, intersection)) {
        const snappedPos: [number, number] = [Math.round(intersection.x), Math.round(intersection.z)];
        const isValid = buildSystem.validatePlacement(snappedPos, buildMode, useStore.getState().buildings);
        actions.setGhostState(snappedPos, isValid);
    }
  };

  const handlePointerDown = (e: PointerEvent) => {
      const { buildMode, targetingMode, ghostPosition, isGhostPlacementValid, materials, selectedSoldierId, actions } = useStore.getState();

      // Right-click for move commands
      if (e.button === 2 && selectedSoldierId && ghostPosition) {
          e.preventDefault();
          actions.setSoldierMoveTarget(selectedSoldierId, ghostPosition);
          actions.selectSoldier(null); // Deselect after issuing command
          return;
      }

      if (targetingMode.active && ghostPosition) {
          const mortar = useStore.getState().buildings.find(b => b.id === targetingMode.fromBuildingId);
          if (mortar) {
              const origin: [number, number, number] = [mortar.cells[0][0], 0.5, mortar.cells[0][1]];
              const target: [number, number, number] = [ghostPosition[0], 0, ghostPosition[1]];
              const projectile = mortarSystem.fire(mortar.id, origin, target);
              if (projectile) {
                  actions.addProjectile(projectile);
              }
          }
          actions.setTargetingMode(false);
          return;
      }

      if (buildMode === 'none' || buildMode.startsWith('recruit') || !isGhostPlacementValid || !ghostPosition) return;
      const cost = buildSystem.getCost(buildMode);
      if (materials < cost) return;

      if (buildMode === 'trench') {
          actions.digTrench(ghostPosition, buildSystem.getSize('trench'));
          actions.spendMaterials(cost);
      } else {
          const kind = (buildMode.charAt(0).toUpperCase() + buildMode.slice(1)) as any;
          actions.addBuilding({ id: uuidv4(), kind: kind, cells: [ghostPosition], hp: buildSystem.getMaxHp(kind), level: 1 });
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
  }, [gl, buildMode, targetingMode]);

  return null;
}

export default InputManager;
