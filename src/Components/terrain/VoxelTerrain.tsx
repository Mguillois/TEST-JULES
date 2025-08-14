import { useStore } from '../../State/store';
import { voxelSystem } from '../../Systems/VoxelSystem';
import { useMemo } from 'react';
import * as THREE from 'three';
import { CHUNK_SIZE } from '../../State/slices/world';

const terrainMaterial = new THREE.MeshStandardMaterial({
  color: '#8A795D',
});

/**
 * A single chunk of the terrain.
 * It generates its geometry based on the world terrain data and its position.
 * It uses a `version` prop to know when to re-compute its geometry.
 */
function TerrainChunk({ chunkX, chunkZ, version }: { chunkX: number, chunkZ: number, version: number }) {
  const geometry = useMemo(() => {
    console.log(`Rebuilding chunk ${chunkX}-${chunkZ} version ${version}`);
    // We get the latest terrain data directly from the store inside useMemo.
    // This ensures the memo only re-runs when the chunk's version changes,
    // but always uses the most up-to-date terrain map for the rebuild.
    const terrainData = useStore.getState().terrain;
    return voxelSystem.generateChunkGeometry(chunkX, chunkZ, terrainData);
  }, [chunkX, chunkZ, version]);

  return <mesh geometry={geometry} material={terrainMaterial} receiveShadow />;
}

/**
 * The main component for rendering the entire voxel terrain.
 */
function VoxelTerrain() {
  const { dimensions, chunkVersions } = useStore(state => ({
    dimensions: state.dimensions,
    chunkVersions: state.chunkVersions,
  }));

  const chunksX = Math.ceil(dimensions[0] / CHUNK_SIZE);
  const chunksZ = Math.ceil(dimensions[1] / CHUNK_SIZE);

  const chunks = [];
  for (let x = 0; x < chunksX; x++) {
    for (let z = 0; z < chunksZ; z++) {
      const key = `${x}-${z}`;
      const version = chunkVersions[key] || 0;
      chunks.push(<TerrainChunk key={key} chunkX={x} chunkZ={z} version={version} />);
    }
  }

  return <group name="voxel-terrain">{chunks}</group>;
}

export default VoxelTerrain;
