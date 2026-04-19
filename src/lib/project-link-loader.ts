export enum OwnershipMode {
  SELF_HOSTED = "self_hosted",
  MANAGED_EXTERNAL = "managed_external",
}

export interface ProjectLinkContext {
  productId: string;
  ownershipMode: OwnershipMode;
  projectLinkPath: string | null;
  productRepoPath: string | null;
  orchestratorRepoPath: string | null;
  productArtifactRoot: string | null;
  orchestrationArtifactRoot: string | null;
  currentPhase: string;
  currentFeature: string;
  emailChannelEnabled: boolean;
  emailDecisionInbox: string;
  emailSender: string;
  rawConfig: Record<string, unknown>;
}

export interface ProjectLinkConfig {
  product_id?: string;
  ownership_mode?: string;
  product_repo?: string | { path?: string };
  orchestrator_repo?: string | { path?: string };
  email_channel?: {
    enabled?: boolean;
    decision_inbox?: string;
    sender?: string;
  };
  current_phase?: string;
  current_feature?: string;
}

function loadProjectLink(projectPath: string): ProjectLinkContext | null {
  return {
    productId: projectPath.split('/').pop() || '',
    ownershipMode: OwnershipMode.SELF_HOSTED,
    projectLinkPath: null,
    productRepoPath: null,
    orchestratorRepoPath: null,
    productArtifactRoot: null,
    orchestrationArtifactRoot: projectPath,
    currentPhase: '',
    currentFeature: '',
    emailChannelEnabled: false,
    emailDecisionInbox: '',
    emailSender: '',
    rawConfig: {},
  };
}

function parseProjectLinkConfig(
  config: ProjectLinkConfig,
  projectLinkPath: string
): ProjectLinkContext {
  const productId = config.product_id || projectLinkPath.split('/').slice(-2, -1)[0];
  
  const modeStr = config.ownership_mode || "self_hosted";
  const ownershipMode = modeStr === "managed_external"
    ? OwnershipMode.MANAGED_EXTERNAL
    : OwnershipMode.SELF_HOSTED;

  let productRepoPath: string | null = null;
  const productRepoRaw = config.product_repo;
  if (typeof productRepoRaw === 'object' && productRepoRaw?.path) {
    productRepoPath = productRepoRaw.path;
  } else if (typeof productRepoRaw === 'string') {
    productRepoPath = productRepoRaw;
  }

  let orchestratorRepoPath: string | null = null;
  const orchestratorRepoRaw = config.orchestrator_repo;
  if (typeof orchestratorRepoRaw === 'object' && orchestratorRepoRaw?.path) {
    orchestratorRepoPath = orchestratorRepoRaw.path;
  } else if (typeof orchestratorRepoRaw === 'string') {
    orchestratorRepoPath = orchestratorRepoRaw;
  }

  const emailChannel = config.email_channel || {};

  const productArtifactRoot = productRepoPath;
  const orchestrationArtifactRoot = projectLinkPath.split('/').slice(0, -1).join('/');

  return {
    productId,
    ownershipMode,
    projectLinkPath,
    productRepoPath,
    orchestratorRepoPath,
    productArtifactRoot,
    orchestrationArtifactRoot,
    currentPhase: config.current_phase || '',
    currentFeature: config.current_feature || '',
    emailChannelEnabled: emailChannel.enabled || false,
    emailDecisionInbox: emailChannel.decision_inbox || '',
    emailSender: emailChannel.sender || '',
    rawConfig: config as Record<string, unknown>,
  };
}

function detectOwnershipMode(projectPath: string): OwnershipMode {
  const context = loadProjectLink(projectPath);
  if (context) {
    return context.ownershipMode;
  }
  return OwnershipMode.SELF_HOSTED;
}

function getProductRepoPath(projectPath: string): string {
  const context = loadProjectLink(projectPath);

  if (context && context.ownershipMode === OwnershipMode.MANAGED_EXTERNAL) {
    if (context.productRepoPath) {
      return context.productRepoPath;
    }
  }

  return projectPath;
}

function getOrchestrationRepoPath(projectPath: string): string {
  const context = loadProjectLink(projectPath);

  if (context && context.orchestratorRepoPath) {
    return context.orchestratorRepoPath;
  }

  return projectPath;
}

function isModeB(projectPath: string): boolean {
  return detectOwnershipMode(projectPath) === OwnershipMode.MANAGED_EXTERNAL;
}

function validateProjectLink(projectPath: string): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];
  const context = loadProjectLink(projectPath);

  if (!context) {
    return { isValid: true, issues: [] };
  }

  if (!context.productId) {
    issues.push("Missing product_id");
  }

  if (context.ownershipMode === OwnershipMode.MANAGED_EXTERNAL) {
    if (!context.productRepoPath) {
      issues.push("Mode B requires product_repo path");
    }
  }

  return { isValid: issues.length === 0, issues };
}

function getProjectLinkSummary(projectPath: string): Record<string, unknown> {
  const context = loadProjectLink(projectPath);

  if (!context) {
    return {
      has_project_link: false,
      ownership_mode: "self_hosted",
      product_id: projectPath.split('/').pop(),
    };
  }

  return {
    has_project_link: true,
    ownership_mode: context.ownershipMode,
    product_id: context.productId,
    product_repo_path: context.productRepoPath,
    orchestrator_repo_path: context.orchestratorRepoPath,
    current_phase: context.currentPhase,
    current_feature: context.currentFeature,
    email_enabled: context.emailChannelEnabled,
  };
}

export {
  loadProjectLink,
  parseProjectLinkConfig,
  detectOwnershipMode,
  getProductRepoPath,
  getOrchestrationRepoPath,
  isModeB,
  validateProjectLink,
  getProjectLinkSummary,
};