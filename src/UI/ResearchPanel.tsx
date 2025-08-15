import { useStore } from '../State/store';
import { TECH_TREE } from '../Core/data';
import type { Tech } from '../Core/Types';

const panelStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    padding: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    border: '1px solid #444',
    color: 'white',
    fontFamily: 'sans-serif',
    zIndex: 10,
};

const techItemStyle: React.CSSProperties = {
    padding: '10px',
    borderBottom: '1px solid #333',
};

const TechItem = ({ tech, isUnlocked, canUnlock, onUnlock }: { tech: Tech, isUnlocked: boolean, canUnlock: boolean, onUnlock: () => void }) => {
    return (
        <div style={techItemStyle}>
            <h3>{tech.name} {isUnlocked && '(Unlocked)'}</h3>
            <p>{tech.description}</p>
            <p>Cost: {tech.cost.materials} Materials</p>
            <button onClick={onUnlock} disabled={isUnlocked || !canUnlock}>
                {isUnlocked ? 'Researched' : 'Unlock'}
            </button>
        </div>
    );
};

function ResearchPanel() {
    const { unlockedTechIds, materials, actions, closePanel } = useStore(state => ({
        unlockedTechIds: state.unlockedTechIds,
        materials: state.materials,
        actions: state.actions,
        closePanel: state.actions.toggleResearchPanel,
    }));

    const handleUnlock = (tech: Tech) => {
        if (materials >= tech.cost.materials) {
            actions.unlockTech(tech.id);
            actions.spendMaterials(tech.cost.materials);
        } else {
            alert('Not enough materials!');
        }
    };

    return (
        <div style={panelStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Research & Development</h2>
                <button onClick={closePanel}>X</button>
            </div>
            <div>
                {Object.values(TECH_TREE).map(tech => {
                    const isUnlocked = unlockedTechIds.includes(tech.id);
                    const depsMet = tech.dependencies.every(depId => unlockedTechIds.includes(depId));
                    const canUnlock = !isUnlocked && depsMet && materials >= tech.cost.materials;
                    return (
                        <TechItem
                            key={tech.id}
                            tech={tech}
                            isUnlocked={isUnlocked}
                            canUnlock={canUnlock}
                            onUnlock={() => handleUnlock(tech)}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default ResearchPanel;
