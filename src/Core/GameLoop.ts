import { useStore } from '../State/store';
import { waveSystem } from '../Systems/WaveSystem';
import { aiSystem } from '../Systems/AISystem';
import { weaponSystem } from '../Systems/WeaponSystem';
import { projectileSystem } from '../Systems/ProjectileSystem';
import { damageSystem } from '../Systems/DamageSystem';
import { suppressionSystem } from '../Systems/SuppressionSystem';
import { economySystem } from '../Systems/EconomySystem';

/**
 * The main game loop tick function.
 */
export function tick(dt: number) {
  const state = useStore.getState();

  // Run systems to compute the next state
  const { newProjectiles, updatedSoldiers, muzzleFlashPositions } = weaponSystem.update(dt, state.soldiers, state.enemies, state.ammo, state.terrain);
  const { updatedProjectiles, hits, impacts } = projectileSystem.update(dt, state.projectiles, state.enemies);
  const enemiesAfterDamage = damageSystem.applyHits(state.enemies, hits, state.terrain);
  const enemiesAfterSuppression = suppressionSystem.update(dt, enemiesAfterDamage, updatedProjectiles);
  const finalEnemies = aiSystem.update(dt, enemiesAfterSuppression, state.buildings);
  const newEnemies = waveSystem.update(dt);

  // Combine the results
  const allEnemies = [...finalEnemies, ...newEnemies];
  const allProjectiles = [...updatedProjectiles, ...newProjectiles];
  const newTime = state.time + dt;
  const ammoSpent = newProjectiles.length;

  // Process one dirty chunk per frame
  state.actions.processDirtyChunk();

  const income = economySystem.update(dt, state.buildings);

  // Batch update the state once at the end of the tick
  useStore.setState({
    time: newTime,
    soldiers: updatedSoldiers,
    enemies: allEnemies,
    projectiles: allProjectiles,
    muzzleFlashes: muzzleFlashPositions,
    impactPuffs: impacts,
    ammo: state.ammo - ammoSpent + income.ammo,
    materials: state.materials + income.materials,
    manpower: state.manpower + income.manpower,
  });
}
