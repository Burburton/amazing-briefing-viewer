import { getMockArtifacts } from './lib/mock-data';
import { deriveBriefing } from './types/briefing';
import { ExecutiveBrief } from './components/ExecutiveBrief';
import { RecommendationCard } from './components/RecommendationCard';
import { BlockerAlert } from './components/BlockerAlert';
import { EvidencePanel } from './components/EvidencePanel';

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
          
          <div className="briefing-card">
            <h3 className="briefing-header">Recent Execution Results</h3>
            <div className="mt-3 space-y-2">
              {briefing.recent_results.slice(0, 3).map((result, i) => (
                <div key={i} className="p-2 bg-gray-50 rounded border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{result.execution_id}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      result.status === 'success' ? 'bg-green-100 text-green-700' :
                      result.status === 'blocked' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {result.status}
                    </span>
                  </div>
                  {result.completed_items && result.completed_items.length > 0 && (
                    <p className="text-xs text-briefing-muted mt-1">
                      {result.completed_items.length} items completed
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
          
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