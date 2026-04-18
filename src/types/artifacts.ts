// Artifact Types for amazing-briefing-viewer
// Based on Artifact Input Contract (Feature 002)

// ============================================
// Product Repo Artifacts
// ============================================

export interface ProductBrief {
  product_id: string;
  product_name: string;
  description: string;
  constraints?: string[];
}

export interface FeatureSpec {
  feature_id: string;
  feature_name: string;
  status: 'pending' | 'in_progress' | 'complete' | 'blocked';
  acceptance_criteria?: string[];
  dependencies?: string[];
}

export interface PhaseSummary {
  phase_id: string;
  phase_name: string;
  status: 'pending' | 'active' | 'complete';
  completed_features?: string[];
  next_phase?: string;
}

export interface DogfoodReport {
  feature_id: string;
  tested_at: string;
  findings: string[];
  recommendations?: string[];
}

export interface FrictionLog {
  session_id: string;
  date: string;
  friction_points: string[];
  severity: 'low' | 'medium' | 'high';
}

// ============================================
// async-dev Repo Artifacts
// ============================================

export interface RunState {
  product_id?: string;
  feature_id?: string;
  current_phase: string;
  last_action?: string;
  updated_at?: string;
  blocked_items?: BlockerItem[];
  decisions_needed?: DecisionNeeded[];
  next_recommended_action?: string;
  continuation_context?: ContinuationContext;
}

export interface BlockerItem {
  item: string;
  reason: string;
  severity?: string;
}

export interface DecisionNeeded {
  decision: string;
  options?: string[];
  recommendation?: string;
}

export interface ContinuationContext {
  continuation_allowed?: boolean;
  next_intended_stage?: string;
  stop_reason?: string;
}

export interface ExecutionResult {
  execution_id: string;
  status: 'success' | 'partial' | 'blocked' | 'failed' | 'stopped';
  completed_items?: string[];
  artifacts_created?: ArtifactCreated[];
  issues_found?: string[];
  recommended_next_step?: string;
  duration?: string;
}

export interface ArtifactCreated {
  name: string;
  path: string;
  type: 'file' | 'artifact' | 'log';
}

export interface ExecutionPack {
  execution_id: string;
  task_scope?: string;
  goal?: string;
  deliverables?: string[];
  stop_conditions?: string[];
}

export interface DecisionRequest {
  decision_request_id: string;
  question: string;
  options?: DecisionOption[];
  recommendation?: string;
  status: 'pending' | 'sent' | 'reply_received' | 'resolved' | 'expired';
  resolution?: string;
  email_sent_mock_path?: string;
  sent_at?: string;
  expires_at?: string;
}

export interface DecisionOption {
  id: string;
  label: string;
  description?: string;
}

// ============================================
// Common Types
// ============================================

export interface ArtifactReference {
  type: string;
  path: string;
  source: 'product' | 'orchestration';
  loaded: boolean;
  error?: string;
}

export type ArtifactType = 
  | 'product_brief'
  | 'feature_spec'
  | 'phase_summary'
  | 'dogfood_report'
  | 'friction_log'
  | 'runstate'
  | 'execution_result'
  | 'execution_pack'
  | 'decision_request';

export interface LoadedArtifacts {
  productBrief?: ProductBrief;
  featureSpecs: FeatureSpec[];
  runState?: RunState;
  executionResults: ExecutionResult[];
  decisionRequests: DecisionRequest[];
  artifacts: ArtifactReference[];
  errors: string[];
}