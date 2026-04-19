import type { EvidenceReference } from '../types/briefing';

interface EvidencePanelProps {
  evidence: EvidenceReference[];
}

function EvidencePanel({ evidence }: EvidencePanelProps) {
  if (evidence.length === 0) {
    return (
      <div className="briefing-card">
        <h3 className="text-h3">Evidence</h3>
        <p className="text-small text-briefing-muted">No artifacts loaded</p>
      </div>
    );
  }

  const productArtifacts = evidence.filter(e => e.source === 'product');
  const orchestrationArtifacts = evidence.filter(e => e.source === 'orchestration');

  return (
    <div className="briefing-card">
      <h3 className="text-h3">Evidence Sources</h3>
      
      {productArtifacts.length > 0 && (
        <div className="mt-3">
          <p className="text-tiny text-briefing-muted uppercase tracking-wide mb-2">Product Repo</p>
          <ul className="space-y-1">
            {productArtifacts.map((artifact, i) => (
              <ArtifactLink key={i} artifact={artifact} />
            ))}
          </ul>
        </div>
      )}

      {orchestrationArtifacts.length > 0 && (
        <div className="mt-4">
          <p className="text-tiny text-briefing-muted uppercase tracking-wide mb-2">Orchestration (async-dev)</p>
          <ul className="space-y-1">
            {orchestrationArtifacts.map((artifact, i) => (
              <ArtifactLink key={i} artifact={artifact} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

interface ArtifactLinkProps {
  artifact: EvidenceReference;
}

function ArtifactLink({ artifact }: ArtifactLinkProps) {
  const typeLabels: Record<string, string> = {
    product_brief: 'Product Brief',
    feature_spec: 'Feature Spec',
    runstate: 'RunState',
    execution_result: 'Execution Result',
    decision_request: 'Decision Request',
  };

  return (
    <li>
      <a 
        href={artifact.path}
        className="text-small text-briefing-accent hover:underline flex items-center gap-1 sm:gap-2 focus-ring rounded"
        title={artifact.path}
      >
        <span className="w-14 sm:w-20 text-briefing-muted text-tiny">{typeLabels[artifact.type] || artifact.type}</span>
        <span className="truncate">{artifact.path.split('/').pop()}</span>
      </a>
    </li>
  );
}

export { EvidencePanel, ArtifactLink };