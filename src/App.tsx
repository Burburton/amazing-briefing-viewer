import { getMockArtifacts } from './lib/mock-data';
import { deriveBriefing, deriveChangeHistory } from './types/briefing';
import { ExecutiveBrief } from './components/ExecutiveBrief';
import { RecommendationCard } from './components/RecommendationCard';
import { BlockerAlert } from './components/BlockerAlert';
import { EvidencePanel } from './components/EvidencePanel';
import { WhatChangedTimeline } from './components/WhatChangedTimeline';

function App() {
  const artifacts = getMockArtifacts();
  const briefing = deriveBriefing(
    artifacts.productBrief,
    artifacts.featureSpecs,
    artifacts.runState,
    artifacts.executionResults,
    artifacts.decisionRequests,
    artifacts.artifacts
  );
  
  const changeHistory = deriveChangeHistory(artifacts.executionResults);

  return (
    <div className="min-h-screen bg-briefing-surface">
      <header className="bg-briefing-primary text-white p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-briefing text-xl">amazing-briefing-viewer</h1>
          <p className="text-sm opacity-80">High-signal project briefing</p>
        </div>
      </header>
      
      <main className="p-6 max-w-4xl mx-auto">
        <div className="space-y-4">
          <ExecutiveBrief summary={briefing.summary} state={briefing.state} />
          
          <RecommendationCard recommendation={briefing.recommendation} />
          
          <BlockerAlert risks={briefing.risks} />
          
          <WhatChangedTimeline events={changeHistory} />
          
          <EvidencePanel evidence={briefing.evidence} />
        </div>
      </main>
      
      <footer className="p-4 text-center text-sm text-briefing-muted">
        <p>amazing-briefing-viewer v0.1.0 • Built for async-dev ecosystem</p>
      </footer>
    </div>
  )
}

export default App