import type { 
  ProductBrief, 
  FeatureSpec, 
  RunState, 
  ExecutionResult, 
  DecisionRequest,
  ArtifactReference,
  LoadedArtifacts,
  BlockerItem,
  DecisionNeeded,
  DecisionOption,
  ArtifactCreated,
  ContinuationContext,
} from '../types/artifacts';
import { 
  OwnershipMode,
  detectOwnershipMode,
  getProductRepoPath,
  getOrchestrationRepoPath,
} from './project-link-loader';
import { 
  ArtifactType,
  routeArtifact,
} from './artifact-router';

interface ProjectConfig {
  productRepoPath: string;
  asyncDevRepoPath: string;
  productId: string;
  projectPath?: string;
}

interface RoutingContext {
  ownershipMode: OwnershipMode;
  productRepoPath: string;
  orchestrationRepoPath: string;
  productId: string;
  productRepoAccessible?: boolean;
}

async function validateProductRepoAccess(path: string): Promise<boolean> {
  try {
    await readFile(`${path}/package.json`);
    return true;
  } catch {
    return false;
  }
}

function getRoutingContext(config: ProjectConfig): RoutingContext {
  const projectPath = config.projectPath || `${config.asyncDevRepoPath}/projects/${config.productId}`;
  const ownershipMode = detectOwnershipMode(projectPath);
  const productRepoPath = ownershipMode === OwnershipMode.MANAGED_EXTERNAL
    ? getProductRepoPath(projectPath)
    : config.productRepoPath;
  const orchestrationRepoPath = getOrchestrationRepoPath(projectPath);

  return {
    ownershipMode,
    productRepoPath,
    orchestrationRepoPath,
    productId: config.productId,
    productRepoAccessible: undefined,
  };
}

async function loadProject(config: ProjectConfig): Promise<LoadedArtifacts> {
  const result: LoadedArtifacts = {
    featureSpecs: [],
    executionResults: [],
    decisionRequests: [],
    artifacts: [],
    errors: [],
  };

  const routing = getRoutingContext(config);

  if (routing.ownershipMode === OwnershipMode.MANAGED_EXTERNAL) {
    routing.productRepoAccessible = await validateProductRepoAccess(routing.productRepoPath);
    if (!routing.productRepoAccessible) {
      result.errors.push(`Product repo not accessible: ${routing.productRepoPath}`);
      result.errors.push('Mode B requires accessible product repo. Check project-link.yaml product_repo path.');
    }
  }

  result.productBrief = await loadProductBrief(routing, result.artifacts, result.errors);
  result.featureSpecs = await loadFeatureSpecs(routing, result.artifacts, result.errors);
  result.runState = await loadRunState(routing, result.artifacts, result.errors);
  result.executionResults = await loadExecutionResults(routing, result.artifacts, result.errors);
  result.decisionRequests = await loadDecisionRequests(routing, result.artifacts, result.errors);

  return result;
}

async function loadProductBrief(
  routing: RoutingContext,
  artifacts: ArtifactReference[],
  errors: string[]
): Promise<ProductBrief | undefined> {
  const routedPath = routeArtifact(ArtifactType.PRODUCT_BRIEF, routing.productRepoPath);
  const basePath = routedPath.targetPath;

  const paths = [
    'docs/product-brief.md',
    'product-brief.md',
  ];

  for (const p of paths) {
    const fullPath = `${basePath}/${p}`;
    try {
      const content = await readFile(fullPath);
      artifacts.push({ type: 'product_brief', path: fullPath, source: 'product', loaded: true });
      return parseProductBrief(content);
    } catch {
      artifacts.push({ type: 'product_brief', path: fullPath, source: 'product', loaded: false });
    }
  }
  
  if (routing.ownershipMode === OwnershipMode.MANAGED_EXTERNAL) {
    errors.push('Product brief not found in product repo (Mode B)');
  } else {
    errors.push('Product brief not found');
  }
  return undefined;
}

async function loadFeatureSpecs(
  routing: RoutingContext,
  artifacts: ArtifactReference[],
  errors: string[]
): Promise<FeatureSpec[]> {
  const specs: FeatureSpec[] = [];
  const routedPath = routeArtifact(ArtifactType.FEATURE_SPEC, routing.productRepoPath);
  const basePath = routedPath.targetPath;
  const featuresDir = `${basePath}/docs/features`;

  try {
    const dirs = await listDirectories(featuresDir);
    for (const dir of dirs) {
      const specPath = `${featuresDir}/${dir}/feature-spec.md`;
      try {
        const content = await readFile(specPath);
        artifacts.push({ type: 'feature_spec', path: specPath, source: 'product', loaded: true });
        specs.push(parseFeatureSpec(content, dir));
      } catch {
        artifacts.push({ type: 'feature_spec', path: specPath, source: 'product', loaded: false });
      }
    }
  } catch {
    if (routing.ownershipMode === OwnershipMode.MANAGED_EXTERNAL) {
      errors.push('Features directory not found in product repo (Mode B)');
    } else {
      errors.push('Features directory not found');
    }
  }

  return specs;
}

async function loadRunState(
  routing: RoutingContext,
  artifacts: ArtifactReference[],
  errors: string[]
): Promise<RunState | undefined> {
  const routedPath = routeArtifact(ArtifactType.RUNSTATE, routing.orchestrationRepoPath);
  const basePath = routedPath.targetPath;
  const path = `${basePath}/projects/${routing.productId}/runstate.md`;
  
  try {
    const content = await readFile(path);
    artifacts.push({ type: 'runstate', path, source: 'orchestration', loaded: true });
    return parseRunState(content);
  } catch {
    artifacts.push({ type: 'runstate', path, source: 'orchestration', loaded: false });
    errors.push('RunState not found in orchestration repo');
    return undefined;
  }
}

async function loadExecutionResults(
  routing: RoutingContext,
  artifacts: ArtifactReference[],
  errors: string[]
): Promise<ExecutionResult[]> {
  const results: ExecutionResult[] = [];
  const routedPath = routeArtifact(ArtifactType.EXECUTION_RESULT, routing.orchestrationRepoPath);
  const basePath = routedPath.targetPath;
  const resultsDir = `${basePath}/projects/${routing.productId}/execution-results`;

  try {
    const files = await listFiles(resultsDir, '.md');
    for (const file of files) {
      const filePath = `${resultsDir}/${file}`;
      try {
        const content = await readFile(filePath);
        artifacts.push({ type: 'execution_result', path: filePath, source: 'orchestration', loaded: true });
        results.push(parseExecutionResult(content));
      } catch {
        artifacts.push({ type: 'execution_result', path: filePath, source: 'orchestration', loaded: false });
      }
    }
  } catch {
    errors.push('Execution results directory not found in orchestration repo');
  }

  return results.sort((a, b) => (b.execution_id || '').localeCompare(a.execution_id || ''));
}

async function loadDecisionRequests(
  routing: RoutingContext,
  artifacts: ArtifactReference[],
  errors: string[]
): Promise<DecisionRequest[]> {
  const requests: DecisionRequest[] = [];
  const routedPath = routeArtifact(ArtifactType.DECISION_REQUEST, routing.orchestrationRepoPath);
  const basePath = routedPath.targetPath;
  const requestsDir = `${basePath}/projects/${routing.productId}/.runtime/decision-requests`;

  try {
    const files = await listFiles(requestsDir, '.md');
    for (const file of files) {
      const filePath = `${requestsDir}/${file}`;
      try {
        const content = await readFile(filePath);
        artifacts.push({ type: 'decision_request', path: filePath, source: 'orchestration', loaded: true });
        requests.push(parseDecisionRequest(content));
      } catch {
        artifacts.push({ type: 'decision_request', path: filePath, source: 'orchestration', loaded: false });
      }
    }
  } catch {
    errors.push('Decision requests directory not found in orchestration repo');
  }

  return requests;
}

function parseProductBrief(content: string): ProductBrief {
  const frontmatter = extractFrontmatter(content);
  return {
    product_id: getString(frontmatter, 'product_id') || '',
    product_name: getString(frontmatter, 'product_name') || getString(frontmatter, 'name') || '',
    description: getString(frontmatter, 'description') || '',
    constraints: getStringArray(frontmatter, 'constraints'),
  };
}

function parseFeatureSpec(content: string, dirName: string): FeatureSpec {
  const frontmatter = extractFrontmatter(content);
  const statusMatch = content.match(/## Status\s*\n\s*`?(\w+)`?/);
  return {
    feature_id: dirName,
    feature_name: getString(frontmatter, 'feature_name') || getString(frontmatter, 'name') || dirName,
    status: (statusMatch?.[1] as FeatureSpec['status']) || 'pending',
    acceptance_criteria: extractList(content, 'Acceptance Criteria'),
    dependencies: getStringArray(frontmatter, 'dependencies'),
  };
}

function parseRunState(content: string): RunState {
  const frontmatter = extractFrontmatter(content);
  return {
    product_id: getString(frontmatter, 'product_id'),
    feature_id: getString(frontmatter, 'feature_id'),
    current_phase: getString(frontmatter, 'current_phase') || 'planning',
    last_action: getString(frontmatter, 'last_action'),
    updated_at: getString(frontmatter, 'updated_at'),
    blocked_items: getBlockerItems(frontmatter, 'blocked_items'),
    decisions_needed: getDecisionsNeeded(frontmatter, 'decisions_needed'),
    next_recommended_action: getString(frontmatter, 'next_recommended_action'),
    continuation_context: getContinuationContext(frontmatter, 'continuation_context'),
  };
}

function parseExecutionResult(content: string): ExecutionResult {
  const frontmatter = extractFrontmatter(content);
  return {
    execution_id: getString(frontmatter, 'execution_id') || '',
    status: (getString(frontmatter, 'status') as ExecutionResult['status']) || 'success',
    completed_items: getStringArray(frontmatter, 'completed_items'),
    artifacts_created: getArtifactsCreated(frontmatter, 'artifacts_created'),
    issues_found: getStringArray(frontmatter, 'issues_found'),
    recommended_next_step: getString(frontmatter, 'recommended_next_step'),
    duration: getString(frontmatter, 'duration'),
  };
}

function parseDecisionRequest(content: string): DecisionRequest {
  const frontmatter = extractFrontmatter(content);
  const statusMatch = content.match(/Status:\s*`?(\w+)`?/i);
  return {
    decision_request_id: getString(frontmatter, 'decision_request_id') || '',
    question: getString(frontmatter, 'question') || '',
    options: getDecisionOptions(frontmatter, 'options'),
    recommendation: getString(frontmatter, 'recommendation'),
    status: (statusMatch?.[1] as DecisionRequest['status']) || 'pending',
    resolution: getString(frontmatter, 'resolution'),
    email_sent_mock_path: getString(frontmatter, 'email_sent_mock_path'),
    sent_at: getString(frontmatter, 'sent_at'),
    expires_at: getString(frontmatter, 'expires_at'),
  };
}

function getString(obj: Record<string, unknown>, key: string): string | undefined {
  const val = obj[key];
  return typeof val === 'string' ? val : undefined;
}

function getStringArray(obj: Record<string, unknown>, key: string): string[] | undefined {
  const val = obj[key];
  return Array.isArray(val) ? val.filter(v => typeof v === 'string') : undefined;
}

function getBlockerItems(obj: Record<string, unknown>, key: string): BlockerItem[] | undefined {
  const val = obj[key];
  if (!Array.isArray(val)) return undefined;
  return val.map(item => {
    if (typeof item === 'object' && item !== null) {
      return {
        item: getString(item as Record<string, unknown>, 'item') || '',
        reason: getString(item as Record<string, unknown>, 'reason') || '',
      };
    }
    return { item: String(item), reason: '' };
  });
}

function getDecisionsNeeded(obj: Record<string, unknown>, key: string): DecisionNeeded[] | undefined {
  const val = obj[key];
  if (!Array.isArray(val)) return undefined;
  return val.map(item => {
    if (typeof item === 'object' && item !== null) {
      return {
        decision: getString(item as Record<string, unknown>, 'decision') || '',
        options: getStringArray(item as Record<string, unknown>, 'options'),
        recommendation: getString(item as Record<string, unknown>, 'recommendation'),
      };
    }
    return { decision: String(item) };
  });
}

function getContinuationContext(obj: Record<string, unknown>, key: string): ContinuationContext | undefined {
  const val = obj[key];
  if (typeof val !== 'object' || val === null) return undefined;
  return {
    continuation_allowed: (val as Record<string, unknown>).continuation_allowed as boolean | undefined,
    next_intended_stage: getString(val as Record<string, unknown>, 'next_intended_stage'),
    stop_reason: getString(val as Record<string, unknown>, 'stop_reason'),
  };
}

function getArtifactsCreated(obj: Record<string, unknown>, key: string): ArtifactCreated[] | undefined {
  const val = obj[key];
  if (!Array.isArray(val)) return undefined;
  return val.map(item => {
    if (typeof item === 'object' && item !== null) {
      const i = item as Record<string, unknown>;
      return {
        name: getString(i, 'name') || '',
        path: getString(i, 'path') || '',
        type: (getString(i, 'type') as ArtifactCreated['type']) || 'file',
      };
    }
    return { name: String(item), path: '', type: 'file' };
  });
}

function getDecisionOptions(obj: Record<string, unknown>, key: string): DecisionOption[] | undefined {
  const val = obj[key];
  if (!Array.isArray(val)) return undefined;
  return val.map(item => {
    if (typeof item === 'object' && item !== null) {
      const i = item as Record<string, unknown>;
      return {
        id: getString(i, 'id') || '',
        label: getString(i, 'label') || '',
        description: getString(i, 'description'),
      };
    }
    return { id: String(item), label: String(item) };
  });
}

function extractFrontmatter(content: string): Record<string, unknown> {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!match) return {};
  
  const yaml = match[1];
  const result: Record<string, unknown> = {};
  
  for (const line of yaml.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      result[key] = parseYamlValue(value);
    }
  }
  
  return result;
}

function parseYamlValue(value: string): unknown {
  if (value.startsWith('[') && value.endsWith(']')) {
    return value.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
  }
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^\d+$/.test(value)) return parseInt(value, 10);
  return value.replace(/^["']|["']$/g, '');
}

function extractList(content: string, header: string): string[] {
  const match = content.match(new RegExp(`## ${header}\\s*\\n([\\s\\S]*?)(?:\\n##|$)`, 'i'));
  if (!match) return [];
  
  return match[1]
    .split('\n')
    .filter(line => line.match(/^-\s*\[x?\]\s*/))
    .map(line => line.replace(/^-\s*\[x?\]\s*/, '').trim());
}

async function readFile(_path: string): Promise<string> {
  return '';
}

async function listDirectories(_path: string): Promise<string[]> {
  return [];
}

async function listFiles(_path: string, _extension: string): Promise<string[]> {
  return [];
}

export { 
  loadProject, 
  loadProductBrief, 
  loadFeatureSpecs, 
  loadRunState, 
  loadExecutionResults, 
  loadDecisionRequests,
  getRoutingContext,
};

export type { ProjectConfig, RoutingContext };