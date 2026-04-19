import { getMockArtifacts } from './lib/mock-data';
import { deriveBriefing } from './types/briefing';
import { ExecutiveBrief } from './components/ExecutiveBrief';
import { RecommendationCard } from './components/RecommendationCard';
import { BlockerAlert } from './components/BlockerAlert';
import { EvidencePanel } from './components/EvidencePanel';
import { DecisionTrace } from './components/DecisionTrace';
import { ReplyQueue } from './components/ReplyQueue';
import { Layout, LayoutGrid, LayoutSection } from './components/Layout';

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

  const pendingDecisions = artifacts.decisionRequests.filter(
    d => d.status === 'pending' || d.status === 'sent'
  );

  return (
    <Layout 
      title="amazing-briefing-viewer"
      subtitle="High-signal project briefing"
    >
      <LayoutGrid columns={2}>
        <LayoutSection title="Project Status">
          <ExecutiveBrief summary={briefing.summary} state={briefing.state} />
          
          <RecommendationCard recommendation={briefing.recommendation} />
          
          <BlockerAlert risks={briefing.risks} />
          
          <div className="briefing-card">
            <h3 className="briefing-header">Recent Execution Results</h3>
            <div className="mt-3 space-y-2">
              {briefing.recent_results.slice(0, 3).map((result, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded border hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{result.execution_id}</span>
                    <span className={`px-2 py-0.5 rounded text-xs focus-ring ${
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
        </LayoutSection>

        <LayoutSection title="Decisions & Evidence">
          <ReplyQueue pendingDecisions={pendingDecisions} />
          
          <DecisionTrace decisions={artifacts.decisionRequests} />
          
          <EvidencePanel evidence={briefing.evidence} />
        </LayoutSection>
      </LayoutGrid>
    </Layout>
  );
}

export default App;