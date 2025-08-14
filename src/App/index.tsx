import Canvas3D from './Canvas3D';
import HUD from '../UI/HUD';
import ResearchPanel from '../UI/ResearchPanel';
import { useStore } from '../State/store';

function App() {
  const isResearchPanelOpen = useStore(state => state.isResearchPanelOpen);

  return (
    <>
      <Canvas3D />
      <HUD />
      {isResearchPanelOpen && <ResearchPanel />}
    </>
  );
}

export default App;
