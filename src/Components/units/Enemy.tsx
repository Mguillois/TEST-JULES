import { Enemy as EnemyType } from '../../Core/Types';

interface EnemyProps {
  enemy: EnemyType;
}

/**
 * Renders a single enemy unit.
 * For now, it's a simple cylinder mesh.
 */
function Enemy({ enemy }: EnemyProps) {
  // The enemy's position is a Vec2 [x, z]. In 3D, this corresponds to [x, y, z].
  // We place the cylinder's base on the ground (y=0), so its center is at y=0.5.
  const position: [number, number, number] = [enemy.pos[0], 0.5, enemy.pos[1]];

  return (
    <mesh position={position} castShadow>
      <cylinderGeometry args={[0.4, 0.4, 1, 8]} />
      <meshStandardMaterial color="#B22222" /> {/* Firebrick Red */}
    </mesh>
  );
}

export default Enemy;
