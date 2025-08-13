import { OrbitControls } from '@react-three/drei';
import GameManager from '../Core/GameManager';
import SoldierGroup from '../Components/units/SoldierGroup';
import EnemyGroup from '../Components/units/EnemyGroup';
import TracerPool from '../Components/units/TracerPool';
import MuzzleFlash from '../Components/units/MuzzleFlash';
import BuildManager from '../Systems/BuildManager';
import GhostPreview from '../Components/buildables/GhostPreview';
import BuildablesGroup from '../Components/buildables/BuildablesGroup';

/**
 * The main 3D scene graph.
 * This component will contain all the 3D elements of the game.
 * For now, it includes basic lighting, a ground plane, and dev controls.
 */
function Scene() {
  return (
    <>
      <GameManager />
      <BuildManager />

      {/* Lighting */}
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

      {/* Placeholder ground plane corresponding to the playfield size */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[120, 80]} />
        <meshStandardMaterial color="#807961" /> {/* A brownish-green color for earth */}
      </mesh>

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

      {/* Development Controls */}
      <OrbitControls />
    </>
  );
}

export default Scene;
