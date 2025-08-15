/**
 * The wave panel.
 * This will display information about the current and upcoming waves.
 */
function WavePanel() {
  // TODO: Implement the wave panel UI
  return (
    <div style={{ position: 'absolute', bottom: '10px', left: '10px', color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px' }}>
      <h3>Wave Panel</h3>
      <p>Next wave in: 30s</p>
    </div>
  );
}

export default WavePanel;
