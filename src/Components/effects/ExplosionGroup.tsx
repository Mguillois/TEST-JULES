import { useStore } from '../../State/store';
import { useState, useEffect } from 'react';
import Explosion from './Explosion';
import type { Explosion as ExplosionType } from '../../Systems/ProjectileSystem';
import { v4 as uuidv4 } from 'uuid';

interface KeyedExplosion extends ExplosionType {
  key: string;
}

function ExplosionGroup() {
  // Subscribe only to a primitive value that changes when new explosions occur.
  const newExplosionCount = useStore(state => state.explosions.length);
  const [activeExplosions, setActiveExplosions] = useState<KeyedExplosion[]>([]);

  useEffect(() => {
    // When the count changes, get the new explosions and add them to our local state.
    const newExplosions = useStore.getState().explosions;
    if (newExplosions.length > 0) {
      const keyed = newExplosions.map((e: ExplosionType) => ({ ...e, key: uuidv4() }));
      setActiveExplosions(prev => [...prev, ...keyed]);
    }
  }, [newExplosionCount]); // This effect only runs when the length changes.

  return (
    <group name="explosions">
      {activeExplosions.map((explosion) => (
        <Explosion key={explosion.key} explosion={explosion} />
      ))}
    </group>
  );
}

export default ExplosionGroup;
