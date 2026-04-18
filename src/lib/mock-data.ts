import type { 
  ProductBrief, 
  FeatureSpec, 
  RunState, 
  ExecutionResult, 
  DecisionRequest,
  LoadedArtifacts 
} from '../types/artifacts';

const mockProductBrief: ProductBrief = {
  product_id: 'amazing-briefing-viewer',
  product_name: 'amazing-briefing-viewer',
  description: 'High-signal project briefing viewer for async-dev ecosystem',
};

const mockFeatureSpecs: FeatureSpec[] = [
  { feature_id: '001-product-north-star', feature_name: 'Product North Star', status: 'complete' },
  { feature_id: '002-artifact-input-contract', feature_name: 'Artifact Input Contract', status: 'complete' },
  { feature_id: '003-project-skeleton', feature_name: 'Project Skeleton', status: 'complete' },
  { feature_id: '004-single-project-loader', feature_name: 'Single-Project Loader', status: 'in_progress' },
  { feature_id: '005-briefing-data-model', feature_name: 'Briefing Data Model', status: 'pending' },
  { feature_id: '006-v1-executive-brief-surface', feature_name: 'V1 Executive Brief Surface', status: 'pending' },
  { feature_id: '007-evidence-panel', feature_name: 'Evidence Panel', status: 'pending' },
];

const mockRunState: RunState = {
  product_id: 'amazing-briefing-viewer',
  feature_id: '004-single-project-loader',
  current_phase: 'executing',
  last_action: 'Implemented artifact types and loader',
  updated_at: new Date().toISOString(),
  blocked_items: [],
  decisions_needed: [],
  next_recommended_action: 'Continue implementing Single-Project Loader - add file serving API',
};

const mockExecutionResults: ExecutionResult[] = [
  {
    execution_id: 'feat-003',
    status: 'success',
    completed_items: [
      'Created Vite project',
      'Added TypeScript config',
      'Added TailwindCSS',
      'Created base App component',
    ],
    artifacts_created: [
      { name: 'package.json', path: '/package.json', type: 'file' },
      { name: 'vite.config.ts', path: '/vite.config.ts', type: 'file' },
      { name: 'App.tsx', path: '/src/App.tsx', type: 'file' },
    ],
    recommended_next_step: 'Implement Single-Project Loader',
    duration: '30 min',
  },
  {
    execution_id: 'feat-001-002',
    status: 'success',
    completed_items: [
      'Product North Star document',
      'Artifact Input Contract',
    ],
    artifacts_created: [
      { name: 'product-north-star.md', path: '/docs/product-north-star.md', type: 'file' },
      { name: 'artifact-input-contract.md', path: '/docs/artifact-input-contract.md', type: 'file' },
    ],
    recommended_next_step: 'Create project skeleton',
    duration: '20 min',
  },
];

const mockDecisionRequests: DecisionRequest[] = [];

function getMockArtifacts(): LoadedArtifacts {
  return {
    productBrief: mockProductBrief,
    featureSpecs: mockFeatureSpecs,
    runState: mockRunState,
    executionResults: mockExecutionResults,
    decisionRequests: mockDecisionRequests,
    artifacts: [
      { type: 'product_brief', path: '/docs/product-north-star.md', source: 'product', loaded: true },
      { type: 'runstate', path: '/projects/amazing-briefing-viewer/runstate.md', source: 'orchestration', loaded: true },
    ],
    errors: [],
  };
}

export { 
  mockProductBrief, 
  mockFeatureSpecs, 
  mockRunState, 
  mockExecutionResults, 
  mockDecisionRequests,
  getMockArtifacts,
};