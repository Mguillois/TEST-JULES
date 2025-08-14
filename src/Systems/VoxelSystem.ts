import { BufferGeometry, Vector3, BufferAttribute } from 'three';

export const CHUNK_SIZE = 16; // 16x16 cells

class VoxelSystem {
  /**
   * Generates a merged BufferGeometry for a single terrain chunk.
   * @param chunkX The X coordinate of the chunk in chunk units.
   * @param chunkZ The Z coordinate of the chunk in chunk units.
   * @param terrainData The full terrain height map for the entire world.
   * @returns A BufferGeometry for the chunk mesh.
   */
  public generateChunkGeometry(chunkX: number, chunkZ: number, terrainData: number[][]): BufferGeometry {
    const vertices: number[] = [];
    const indices: number[] = [];
    const normals: number[] = []; // We will compute normals manually for flat shading
    const worldWidth = terrainData.length;
    const worldDepth = terrainData[0]?.length || 0;

    const startX = chunkX * CHUNK_SIZE;
    const startZ = chunkZ * CHUNK_SIZE;

    for (let x = 0; x < CHUNK_SIZE; x++) {
      for (let z = 0; z < CHUNK_SIZE; z++) {
        const worldX = startX + x;
        const worldZ = startZ + z;

        if (worldX >= worldWidth - 1 || worldZ >= worldDepth - 1) continue;

        // Get the four corner heights for this quad
        const h1 = terrainData[worldX][worldZ];
        const h2 = terrainData[worldX + 1][worldZ];
        const h3 = terrainData[worldX][worldZ + 1];
        const h4 = terrainData[worldX + 1][worldZ + 1];

        // Define the 4 vertices of the quad, centered around the world origin
        const p1 = new Vector3(worldX - worldWidth / 2, h1, worldZ - worldDepth / 2);
        const p2 = new Vector3(worldX + 1 - worldWidth / 2, h2, worldZ - worldDepth / 2);
        const p3 = new Vector3(worldX - worldWidth / 2, h3, worldZ + 1 - worldDepth / 2);
        const p4 = new Vector3(worldX + 1 - worldWidth / 2, h4, worldZ + 1 - worldDepth / 2);

        const vIndex = vertices.length / 3;
        vertices.push(p1.x, p1.y, p1.z);
        vertices.push(p2.x, p2.y, p2.z);
        vertices.push(p3.x, p3.y, p3.z);
        vertices.push(p4.x, p4.y, p4.z);

        // Two triangles for the quad
        indices.push(vIndex, vIndex + 2, vIndex + 1, vIndex + 1, vIndex + 2, vIndex + 3);

        // Calculate normals for flat shading (one normal per triangle)
        const tri1 = new THREE.Triangle(p1, p3, p2);
        const normal1 = new Vector3();
        tri1.getNormal(normal1);

        const tri2 = new THREE.Triangle(p2, p3, p4);
        const normal2 = new Vector3();
        tri2.getNormal(normal2);

        // Add the normal for each vertex of the two triangles
        for (let i = 0; i < 4; i++) {
            // This is a simplification; for true flat shading, vertices would need to be duplicated.
            // For now, we average the normals of the two triangles for each vertex.
            const normal = new Vector3().add(normal1).add(normal2).normalize();
            normals.push(normal.x, normal.y, normal.z);
        }
      }
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
    geometry.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
    geometry.setIndex(indices);
    // geometry.computeVertexNormals(); // Use our own normals instead

    return geometry;
  }
}

export const voxelSystem = new VoxelSystem();
