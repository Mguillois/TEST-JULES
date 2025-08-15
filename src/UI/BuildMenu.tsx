/**
 * The build menu panel.
 * This will allow the player to select structures to build.
 */
function BuildMenu() {
  // TODO: Implement the build menu UI
  return (
    <div style={{ position: 'absolute', top: '100px', left: '10px', color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px' }}>
      <h2>Build Menu</h2>
      <ul>
        <li>Trench (1)</li>
        <li>Barbed Wire (2)</li>
        <li>MG Nest (3)</li>
        <li>Bunker (4)</li>
      </ul>
    </div>
  );
}

export default BuildMenu;
