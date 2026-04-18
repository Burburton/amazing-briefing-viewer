import type { 
  RunState, 
  ExecutionResult, 
  FeatureSpec, 
  ProductBrief,
  DecisionRequest,
  ArtifactReference,
} from './artifacts';

type ProjectStatus = 'active' | 'paused' | 'blocked' | 'completed' | 'unknown';
type RiskLevel = 'high' | 'medium' | 'low';

interface BriefingSummary {
  product_id: string;
  product_name: string;
  status: ProjectStatus;
  current_phase: string;
  current_feature?: string;
  last_action?: string;
  updated_at?: string;
  has_blockers: boolean;
  has_decisions_needed: boolean;
  completed_features: number;
  total_features: number;
}

interface StateSnapshot {
  phase: string;
  feature?: string;
  last_action?: string;
  updated_at?: string;
  continuation_allowed?: boolean;
  next_intended_stage?: string;
  stop_reason?: string;
}

interface Risk {
  item: string;
  reason: string;
  level: RiskLevel;
  source: 'blocked_item' | 'issue_found' | 'friction';
}

interface Recommendation {
  action: string;
  reason?: string;
  autonomous: boolean;
  requires_decision: boolean;
  decision_options?: string[];
}

interface EvidenceReference {
  type: string;
  path: string;
  source: 'product' | 'orchestration';
  description?: string;
}

interface Briefing {
  summary: BriefingSummary;
  state: StateSnapshot;
  risks: Risk[];
  recommendation: Recommendation;
  evidence: EvidenceReference[];
  recent_results: ExecutionResult[];
  pending_decisions: DecisionRequest[];
}

function deriveBriefing(
  productBrief: ProductBrief | undefined,
  featureSpecs: FeatureSpec[],
  runState: RunState | undefined,
  executionResults: ExecutionResult[],
  decisionRequests: DecisionRequest[],
  artifacts: ArtifactReference[]
): Briefing {
  const completedCount = featureSpecs.filter(f => f.status === 'complete').length;
  const totalCount = featureSpecs.length;
  const latestResult = executionResults[0];

  const summary: BriefingSummary = {
    product_id: productBrief?.product_id || 'unknown',
    product_name: productBrief?.product_name || 'Unknown Project',
    status: deriveStatus(runState),
    current_phase: runState?.current_phase || 'unknown',
    current_feature: runState?.feature_id,
    last_action: runState?.last_action,
    updated_at: runState?.updated_at,
    has_blockers: (runState?.blocked_items?.length || 0) > 0,
    has_decisions_needed: (runState?.decisions_needed?.length || 0) > 0,
    completed_features: completedCount,
    total_features: totalCount,
  };

  const state: StateSnapshot = {
    phase: runState?.current_phase || 'unknown',
    feature: runState?.feature_id,
    last_action: runState?.last_action,
    updated_at: runState?.updated_at,
    continuation_allowed: runState?.continuation_context?.continuation_allowed,
    next_intended_stage: runState?.continuation_context?.next_intended_stage,
    stop_reason: runState?.continuation_context?.stop_reason,
  };

  const risks: Risk[] = [
    ...deriveRisksFromBlockers(runState?.blocked_items || []),
    ...deriveRisksFromIssues(executionResults),
  ];

  const recommendation: Recommendation = deriveRecommendation(
    runState,
    latestResult,
    decisionRequests
  );

  const evidence: EvidenceReference[] = artifacts
    .filter(a => a.loaded)
    .map(a => ({
      type: a.type,
      path: a.path,
      source: a.source,
    }));

  return {
    summary,
    state,
    risks,
    recommendation,
    evidence,
    recent_results: executionResults.slice(0, 5),
    pending_decisions: decisionRequests.filter(d => d.status === 'pending' || d.status === 'sent'),
  };
}

function deriveStatus(runState: RunState | undefined): ProjectStatus {
  if (!runState) return 'unknown';
  
  const blockedCount = runState.blocked_items?.length ?? 0;
  const decisionCount = runState.decisions_needed?.length ?? 0;
  
  if (blockedCount > 0) return 'blocked';
  if (decisionCount > 0) return 'paused';
  if (runState.current_phase === 'completed') return 'completed';
  
  return 'active';
}

function deriveRisksFromBlockers(blockers: { item: string; reason: string }[]): Risk[] {
  return blockers.map(b => ({
    item: b.item,
    reason: b.reason,
    level: 'high' as RiskLevel,
    source: 'blocked_item' as const,
  }));
}

function deriveRisksFromIssues(results: ExecutionResult[]): Risk[] {
  const risks: Risk[] = [];
  
  for (const result of results) {
    for (const issue of result.issues_found || []) {
      risks.push({
        item: issue,
        reason: 'Found in execution result',
        level: 'medium' as RiskLevel,
        source: 'issue_found' as const,
      });
    }
  }
  
  return risks;
}

function deriveRecommendation(
  runState: RunState | undefined,
  latestResult: ExecutionResult | undefined,
  decisionRequests: DecisionRequest[]
): Recommendation {
  const pendingRequest = decisionRequests.find(d => d.status === 'pending' || d.status === 'sent');
  
  if (pendingRequest) {
    return {
      action: pendingRequest.question,
      reason: pendingRequest.recommendation,
      autonomous: false,
      requires_decision: true,
      decision_options: pendingRequest.options?.map(o => o.id),
    };
  }
  
  if ((runState?.blocked_items?.length ?? 0) > 0) {
    const blocker = runState!.blocked_items![0];
    return {
      action: `Resolve blocker: ${blocker.item}`,
      reason: blocker.reason,
      autonomous: false,
      requires_decision: true,
    };
  }
  
  if (runState?.next_recommended_action) {
    return {
      action: runState.next_recommended_action,
      reason: 'From RunState',
      autonomous: true,
      requires_decision: false,
    };
  }
  
  if (latestResult?.recommended_next_step) {
    return {
      action: latestResult.recommended_next_step,
      reason: 'From latest execution result',
      autonomous: true,
      requires_decision: false,
    };
  }
  
  return {
    action: 'No recommendation available',
    autonomous: false,
    requires_decision: false,
  };
}

export type {
  ProjectStatus,
  RiskLevel,
  BriefingSummary,
  StateSnapshot,
  Risk,
  Recommendation,
  EvidenceReference,
  Briefing,
};

type ChangeEventType = 'feature_complete' | 'execution_success' | 'execution_failed' | 'blocker_added' | 'blocker_resolved' | 'decision_requested' | 'decision_resolved' | 'phase_change';

interface ChangeEvent {
  id: string;
  type: ChangeEventType;
  description: string;
  timestamp: string;
  feature_id?: string;
  execution_id?: string;
  evidence_path?: string;
}

function deriveChangeEvent(executionResult: ExecutionResult): ChangeEvent[] {
  const events: ChangeEvent[] = [];
  
  for (const item of executionResult.completed_items || []) {
    events.push({
      id: `${executionResult.execution_id}-${item}`,
      type: executionResult.status === 'success' ? 'execution_success' : 'execution_failed',
      description: item,
      timestamp: executionResult.duration || '',
      execution_id: executionResult.execution_id,
    });
  }
  
  return events;
}

function deriveChangeHistory(executionResults: ExecutionResult[]): ChangeEvent[] {
  const allEvents: ChangeEvent[] = [];
  
  for (const result of executionResults) {
    allEvents.push(...deriveChangeEvent(result));
  }
  
  return allEvents.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export type { ChangeEventType, ChangeEvent };

export { deriveBriefing, deriveChangeHistory };