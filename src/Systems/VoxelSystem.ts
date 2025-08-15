import { BufferGeometry, Vector3, BufferAttribute } from 'three';

export const CHUNK_SIZE = 16; // 16x16 cells

class VoxelSystem {
  public generateChunkGeometry(chunkX: number, chunkZ: number, terrainData: number[][]): BufferGeometry {
    const vertices: number[] = [];
    const indices: number[] = [];
    const worldWidth = terrainData.length;
    const worldDepth = terrainData[0]?.length || 0;

    const startX = chunkX * CHUNK_SIZE;
    const startZ = chunkZ * CHUNK_SIZE;

    for (let x = 0; x < CHUNK_SIZE; x++) {
      for (let z = 0; z < CHUNK_SIZE; z++) {
        const worldX = startX + x;
        const worldZ = startZ + z;

        if (worldX >= worldWidth - 1 || worldZ >= worldDepth - 1) continue;

        const h = terrainData[worldX][worldZ];

        if (h < 0) { // This is a trench cell
          const trenchDepth = h; // e.g., -1.8
          const firestepHeight = trenchDepth + 0.3;

          // Generate two quads for the trench floor and fire-step
          // Back half of the cell (fire-step)
          const p1 = new Vector3(worldX - worldWidth / 2, firestepHeight, worldZ - worldDepth / 2);
          const p2 = new Vector3(worldX + 1 - worldWidth / 2, firestepHeight, worldZ - worldDepth / 2);
          const p3 = new Vector3(worldX - worldWidth / 2, firestepHeight, worldZ + 0.5 - worldDepth / 2);
          const p4 = new Vector3(worldX + 1 - worldWidth / 2, firestepHeight, worldZ + 0.5 - worldDepth / 2);

          let vIndex = vertices.length / 3;
          vertices.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z, p4.x, p4.y, p4.z);
          indices.push(vIndex, vIndex + 2, vIndex + 1, vIndex + 1, vIndex + 2, vIndex + 3);

          // Front half of the cell (trench floor)
          const p5 = new Vector3(worldX - worldWidth / 2, trenchDepth, worldZ + 0.5 - worldDepth / 2);
          const p6 = new Vector3(worldX + 1 - worldWidth / 2, trenchDepth, worldZ + 0.5 - worldDepth / 2);
          const p7 = new Vector3(worldX - worldWidth / 2, trenchDepth, worldZ + 1 - worldDepth / 2);
          const p8 = new Vector3(worldX + 1 - worldWidth / 2, trenchDepth, worldZ + 1 - worldDepth / 2);

          vIndex = vertices.length / 3;
          vertices.push(p5.x, p5.y, p5.z, p6.x, p6.y, p6.z, p7.x, p7.y, p7.z, p8.x, p8.y, p8.z);
          indices.push(vIndex, vIndex + 2, vIndex + 1, vIndex + 1, vIndex + 2, vIndex + 3);

        } else { // This is normal ground
          const h1 = terrainData[worldX][worldZ];
          const h2 = terrainData[worldX + 1][worldZ];
          const h3 = terrainData[worldX][worldZ + 1];
          const h4 = terrainData[worldX + 1][worldZ + 1];

          const p1 = new Vector3(worldX - worldWidth / 2, h1, worldZ - worldDepth / 2);
          const p2 = new Vector3(worldX + 1 - worldWidth / 2, h2, worldZ - worldDepth / 2);
          const p3 = new Vector3(worldX - worldWidth / 2, h3, worldZ + 1 - worldDepth / 2);
          const p4 = new Vector3(worldX + 1 - worldWidth / 2, h4, worldZ + 1 - worldDepth / 2);

          const vIndex = vertices.length / 3;
          vertices.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z, p4.x, p4.y, p4.z);
          indices.push(vIndex, vIndex + 2, vIndex + 1, vIndex + 1, vIndex + 2, vIndex + 3);
        }
      }
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
  }
}

export const voxelSystem = new VoxelSystem();
