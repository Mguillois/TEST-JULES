import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import GameManager from '../Core/GameManager';
import StateBridge from '../Core/StateBridge';
import SoldierGroup from '../Components/units/SoldierGroup';
import EnemyGroup from '../Components/units/EnemyGroup';
import TracerPool from '../Components/units/TracerPool';
import MuzzleFlash from '../Components/units/MuzzleFlash';
import ImpactPuff from '../Components/effects/ImpactPuff';
import InputManager from '../Systems/InputManager';
import GhostPreview from '../Components/buildables/GhostPreview';
import BuildablesGroup from '../Components/buildables/BuildablesGroup';
import VoxelTerrain from '../Components/terrain/VoxelTerrain';
import SmokeEmitter from '../Components/effects/SmokeEmitter';
import TargetReticule from '../Components/effects/TargetReticule';
import ExplosionGroup from '../Components/effects/ExplosionGroup';
import Rain from '../Components/effects/Rain';

/**
 * The main 3D scene graph.
 * This component will contain all the 3D elements of the game.
 * For now, it includes basic lighting, a ground plane, and dev controls.
 */
function Scene() {
  return (
    <>
      <GameManager />
      <StateBridge />
      <InputManager />

      {/* Environment */}
      <fog attach="fog" args={['#5B5D5A', 50, 150]} />
      <Rain />
      <SmokeEmitter position={new THREE.Vector3(0, 0, -20)} />
      <SmokeEmitter position={new THREE.Vector3(-30, 0, -10)} />
      <SmokeEmitter position={new THREE.Vector3(30, 0, 0)} />
      <ambientLight intensity={0.5} />
      <directionalLight
        castShadow
        position={[10, 30, 20]} // Position the light to cast reasonable shadows
        intensity={1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={100}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />

      <VoxelTerrain />

      {/* A simple box to test shadows and lighting */}
      <mesh castShadow position={[0, 1, 0]}>
        <boxGeometry args={[2, 2, 2]}/>
        <meshStandardMaterial color="orange" />
      </mesh>

      <SoldierGroup />
      <EnemyGroup />
      <BuildablesGroup />

      {/* Visual Effects */}
      <GhostPreview />
      <TracerPool />
      <MuzzleFlash />
      <ImpactPuff />
      <TargetReticule />
      <ExplosionGroup />

      {/* Development Controls */}
      <OrbitControls />
    </>
  );
}

export default Scene;
