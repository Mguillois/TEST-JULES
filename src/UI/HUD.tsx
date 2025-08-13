import { useStore } from '../State/store';
import { AppState } from '../State/store';

// Selector to get only the needed state for the HUD
// This prevents re-renders when other parts of the state change
const hudSelector = (state: AppState) => ({
  wave: state.wave,
  time: state.time,
  // TODO: Add economy and perf stats here once available
});

/**
 * The main Heads-Up Display for the game.
 * It shows critical information like wave, time, resources, and FPS.
 */
function HUD() {
  const { wave, time } = useStore(hudSelector);

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
    zIndex: 1, // Ensure it's on top of the canvas
  };

  return (
    <div style={hudStyle}>
      <div>Wave: {wave}</div>
      <div>Time: {Math.floor(time)}s</div>
      {/* Placeholders for economy and perf from spec */}
      <div>Ammo: 1000</div>
      <div>Materials: 500</div>
      <div>Manpower: 50</div>
      <div>FPS: --</div>
    </div>
  );
}

export default HUD;
