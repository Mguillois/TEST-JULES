import { useStore } from '../State/store';

/**
 * The main Heads-Up Display for the game.
 */
function HUD() {
  const wave = useStore(state => state.wave);
  const time = useStore(state => state.time);
  const ammo = useStore(state => state.ammo);
  const materials = useStore(state => state.materials);
  const manpower = useStore(state => state.manpower);
  const toggleResearchPanel = useStore(state => state.actions.toggleResearchPanel);

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
    zIndex: 1,
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
      <button onClick={toggleResearchPanel} style={buttonStyle}>Research</button>
      <button onClick={handleReset} style={buttonStyle}>Reset Game</button>
    </div>
  );
}

export default HUD;
