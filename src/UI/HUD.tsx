import { useStore } from '../State/store';
import { AppState } from '../State/store';

// Selector to get only the needed state for the HUD
const hudSelector = (state: AppState) => ({
  wave: state.wave,
  time: state.time,
  ammo: state.ammo,
  materials: state.materials,
  manpower: state.manpower,
});

/**
 * The main Heads-Up Display for the game.
 * It shows critical information like wave, time, resources, and FPS.
 */
function HUD() {
  const { wave, time, ammo, materials, manpower } = useStore(hudSelector);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      useStore.persist.clearStorage();
      window.location.reload();
    }
  };

  const hudStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    padding: '10px',
    color: 'white',
    fontFamily: 'sans-serif',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 1, // Ensure it's on top of the canvas
  };

  const buttonStyle: React.CSSProperties = {
    padding: '5px 10px',
    color: 'white',
    backgroundColor: '#dc3545',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  return (
    <div style={hudStyle}>
      <div>Wave: {wave}</div>
      <div>Time: {Math.floor(time)}s</div>
      <div>Ammo: {ammo}</div>
      <div>Materials: {materials}</div>
      <div>Manpower: {manpower}</div>
      <div>FPS: --</div>
      <button onClick={handleReset} style={buttonStyle}>Reset Game</button>
    </div>
  );
}

export default HUD;
