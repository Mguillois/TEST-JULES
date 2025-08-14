import * as THREE from 'three';
import { Soldier as SoldierType } from '../../Core/Types';
import { useStore } from '../../State/store';
import { Ring } from '@react-three/drei';

interface SoldierProps {
  soldier: SoldierType;
}

const COLORS = {
    rifleman: '#4682B4', // Steel Blue
    medic: '#FFFFFF',    // White
    engineer: '#FFA500', // Orange
};
const bodyMaterial = new THREE.MeshStandardMaterial();
const rifleMaterial = new THREE.MeshStandardMaterial({ color: '#5C4033' }); // Dark brown

function Soldier({ soldier }: SoldierProps) {
  const { selectedSoldierId, selectSoldier } = useStore(state => ({
    selectedSoldierId: state.selectedSoldierId,
    selectSoldier: state.actions.selectSoldier,
  }));

  const position: [number, number, number] = [soldier.pos[0], 0, soldier.pos[1]];
  const color = COLORS[soldier.classId] || COLORS.rifleman;
  const isSelected = soldier.id === selectedSoldierId;

  const handleClick = (e: any) => {
    e.stopPropagation();
    selectSoldier(soldier.id);
  };

  return (
    <group position={position} onClick={handleClick}>
        {/* Body */}
        <mesh castShadow position={[0, 0.4, 0]}>
            <capsuleGeometry args={[0.3, 0.5, 4, 8]} />
            <meshStandardMaterial color={color} />
        </mesh>
        {/* Head */}
        <mesh castShadow position={[0, 1.1, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color={color} />
        </mesh>
        {/* Rifle */}
        <mesh castShadow position={[0, 0.7, 0.3]} material={rifleMaterial}>
            <boxGeometry args={[0.1, 0.1, 0.8]} />
        </mesh>

        {isSelected && (
            <Ring args={[0.6, 0.7, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                <meshBasicMaterial color="white" toneMapped={false} />
            </Ring>
        )}
    </group>
  );
}

export default Soldier;
