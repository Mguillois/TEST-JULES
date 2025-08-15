import { useStore } from '../../State/store';
import { useState, useEffect } from 'react';
import Explosion from './Explosion';
import type { Explosion as ExplosionType } from '../../Systems/ProjectileSystem';
import { v4 as uuidv4 } from 'uuid';
import { shallow } from 'zustand/shallow';

interface KeyedExplosion extends ExplosionType {
  key: string;
}

function ExplosionGroup() {
  // Subscribing to an array can cause re-renders. `shallow` helps here.
  const newExplosions = useStore(state => state.explosions, shallow);
  const [activeExplosions, setActiveExplosions] = useState<KeyedExplosion[]>([]);

  useEffect(() => {
    if (newExplosions.length > 0) {
      const keyed = newExplosions.map(e => ({ ...e, key: uuidv4() }));
      setActiveExplosions(prev => [...prev, ...keyed]);
    }
  }, [newExplosions]);

  return (
    <group name="explosions">
      {activeExplosions.map((explosion) => (
        <Explosion key={explosion.key} explosion={explosion} />
      ))}
    </group>
  );
}

export default ExplosionGroup;
