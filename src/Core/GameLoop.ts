import { useStore } from '../State/store';
import { waveSystem } from '../Systems/WaveSystem';
import { aiSystem } from '../Systems/AISystem';
import { weaponSystem } from '../Systems/WeaponSystem';
import { projectileSystem } from '../Systems/ProjectileSystem';
import { damageSystem } from '../Systems/DamageSystem';

/**
 * The main game loop tick function.
 * This function is called on every frame and is responsible for orchestrating the update of the game state.
 * It calls various systems, which compute changes, and then commits the new state to the store in a single batch.
 *
 * @param dt The delta time in seconds since the last frame.
 */
export function tick(dt: number) {
  const state = useStore.getState();

  // Run systems to compute the next state
  const { newProjectiles, updatedSoldiers, muzzleFlashPositions, ammoSpent } = weaponSystem.update(dt, state.soldiers, state.enemies, state.ammo);
  const { updatedProjectiles, hits } = projectileSystem.update(dt, state.projectiles, state.enemies);
  const enemiesAfterDamage = damageSystem.applyHits(state.enemies, hits);
  const finalEnemies = aiSystem.update(dt, enemiesAfterDamage);
  const newEnemies = waveSystem.update(dt);

  // Combine the results
  const allEnemies = [...finalEnemies, ...newEnemies];
  const allProjectiles = [...updatedProjectiles, ...newProjectiles];
  const newTime = state.time + dt;

  // Batch update the state once at the end of the tick
  useStore.setState({
    time: newTime,
    soldiers: updatedSoldiers,
    enemies: allEnemies,
    projectiles: allProjectiles,
    muzzleFlashes: muzzleFlashPositions,
    ammo: state.ammo - ammoSpent,
  });
}
