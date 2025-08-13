import * as THREE from 'three';
import { Soldier as SoldierType } from '../../Core/Types';

interface SoldierProps {
  soldier: SoldierType;
}

/**
 * Renders a single soldier unit.
 * For now, it's a simple cylinder mesh.
 */
function Soldier({ soldier }: SoldierProps) {
  // The soldier's position is a Vec2 [x, z]. In 3D, this corresponds to [x, y, z].
  // We place the cylinder's base on the ground (y=0), so its center is at y=0.5.
  const position: [number, number, number] = [soldier.pos[0], 0.5, soldier.pos[1]];

  return (
    <mesh position={position} castShadow>
      <cylinderGeometry args={[0.4, 0.4, 1, 8]} />
      <meshStandardMaterial color={soldier.team === 'Player' ? '#4682B4' : '#B22222'} />
    </mesh>
  );
}

export default Soldier;
