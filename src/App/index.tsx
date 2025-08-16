import { useEffect } from 'react';
import Canvas3D from './Canvas3D';
import HUD from '../UI/HUD';
import ResearchPanel from '../UI/ResearchPanel';
import { useStore } from '../State/store';

function App() {
  const isResearchPanelOpen = useStore(state => state.isResearchPanelOpen);
  const { setBuildMode, setTargetingMode } = useStore.getState().actions;

  // This effect runs once on startup and resets any transient UI state
  // that shouldn't be persisted, ensuring a clean start after a page load.
  useEffect(() => {
    setBuildMode('none');
    setTargetingMode(false);
  }, []);

  return (
    <>
      <Canvas3D />
      <HUD />
      {isResearchPanelOpen && <ResearchPanel />}
    </>
  );
}

export default App;
