import { useStore } from '../../State/store';
import { useState, useEffect } from 'react';
import Explosion from './Explosion';
import type { Explosion as ExplosionType } from '../../Systems/ProjectileSystem';
import { v4 as uuidv4 } from 'uuid';

// We need to give each explosion a unique key for React to render it correctly.
interface KeyedExplosion extends ExplosionType {
  key: string;
}

function ExplosionGroup() {
  const newExplosions = useStore(state => state.explosions);
  const [activeExplosions, setActiveExplosions] = useState<KeyedExplosion[]>([]);

  useEffect(() => {
    if (newExplosions.length > 0) {
      const keyed = newExplosions.map(e => ({ ...e, key: uuidv4() }));
      setActiveExplosions(prev => [...prev, ...keyed]);
    }
  }, [newExplosions]);

  // This is a simple way to manage the list. A more robust system might
  // have the Explosion component report when it's done, but for a short-lived
  // effect, just letting them accumulate and relying on their internal visibility
  // logic is acceptable for now. A production system would pool these.
  return (
    <group name="explosions">
      {activeExplosions.map((explosion) => (
        <Explosion key={explosion.key} explosion={explosion} />
      ))}
    </group>
  );
}

export default ExplosionGroup;
