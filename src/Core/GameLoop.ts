import { gameState } from '../State/game-state';
import { waveSystem } from '../Systems/WaveSystem';
import { aiSystem } from '../Systems/AISystem';
import { weaponSystem } from '../Systems/WeaponSystem';
import { projectileSystem } from '../Systems/ProjectileSystem';
import { damageSystem } from '../Systems/DamageSystem';
import { suppressionSystem } from '../Systems/SuppressionSystem';
import { economySystem } from '../Systems/EconomySystem';
import { medicSystem } from '../Systems/MedicSystem';
import { engineerSystem } from '../Systems/EngineerSystem';
import { playerAISystem } from '../Systems/PlayerAISystem';
import { weatherSystem } from '../Systems/WeatherSystem';
import type { Terrain } from '../Core/Types';

/**
 * The main game loop tick function.
 */
export function tick(dt: number, isRaining: boolean, terrain: Terrain) {
  const state = gameState.getState();

  // 1. Update weather
  weatherSystem.update(dt);

  // 2. Update player soldiers
  const soldiersAfterMove = playerAISystem.update(dt, state.soldiers, isRaining);
  const { newProjectiles, updatedSoldiers: soldiersAfterWeapons, muzzleFlashPositions } = weaponSystem.update(dt, soldiersAfterMove, state.enemies, state.ammo, terrain);
  const soldiersAfterMedics = medicSystem.update(dt, soldiersAfterWeapons);
  const { updatedSoldiers: finalSoldiers, updatedBuildings } = engineerSystem.update(dt, soldiersAfterMedics, state.buildings);

  // 3. Update projectiles and enemies
  const { updatedProjectiles, hits, impacts, explosions } = projectileSystem.update(dt, state.projectiles, state.enemies);
  const enemiesAfterDamage = damageSystem.applyHits(state.enemies, hits, terrain, explosions);
  const enemiesAfterSuppression = suppressionSystem.update(dt, enemiesAfterDamage, updatedProjectiles);
  const { updatedEnemies: finalEnemies, updatedBuildings: finalBuildings } = aiSystem.update(dt, enemiesAfterSuppression, updatedBuildings, isRaining);

  // 4. Spawn new enemies
  const newEnemies = waveSystem.update(dt);

  // --- Combine all results ---
  const allEnemies = [...finalEnemies, ...newEnemies];
  const allProjectiles = [...updatedProjectiles, ...newProjectiles];
  const newTime = state.time + dt;
  const ammoSpent = newProjectiles.filter(p => !p.explosion).length;
  const income = economySystem.update(dt, finalBuildings);

  // --- Batch update the state once at the end of the tick ---
  gameState.setState({
    time: newTime,
    soldiers: finalSoldiers,
    buildings: finalBuildings,
    enemies: allEnemies,
    projectiles: allProjectiles,
    muzzleFlashes: muzzleFlashPositions,
    impactPuffs: impacts,
    explosions: explosions,
    ammo: state.ammo - ammoSpent + income.ammo,
    materials: state.materials + income.materials,
    manpower: state.manpower + income.manpower,
  });
}
