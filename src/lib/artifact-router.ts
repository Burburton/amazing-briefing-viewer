import {
  OwnershipMode,
  loadProjectLink,
  getProductRepoPath,
  getOrchestrationRepoPath,
  isModeB,
} from './project-link-loader';

export enum ArtifactType {
  PRODUCT_BRIEF = "product_brief",
  FEATURE_SPEC = "feature_spec",
  FEATURE_COMPLETION_REPORT = "feature_completion_report",
  DOGFOOD_REPORT = "dogfood_report",
  FRICTION_LOG = "friction_log",
  PHASE_SUMMARY = "phase_summary",
  NORTH_STAR = "north_star",
  PRODUCT_MEMORY = "product_memory",

  EXECUTION_PACK = "execution_pack",
  EXECUTION_RESULT = "execution_result",
  RUNSTATE = "runstate",
  VERIFICATION_RECORD = "verification_record",
  CONTINUATION_STATE = "continuation_state",
  PROJECT_LINK = "project_link",
  DECISION_REQUEST = "decision_request",

  DAILY_REVIEW_PACK = "daily_review_pack",
}

export const PRODUCT_OWNED_ARTIFACTS: Set<ArtifactType> = new Set([
  ArtifactType.PRODUCT_BRIEF,
  ArtifactType.FEATURE_SPEC,
  ArtifactType.FEATURE_COMPLETION_REPORT,
  ArtifactType.DOGFOOD_REPORT,
  ArtifactType.FRICTION_LOG,
  ArtifactType.PHASE_SUMMARY,
  ArtifactType.NORTH_STAR,
  ArtifactType.PRODUCT_MEMORY,
]);

export const ORCHESTRATION_OWNED_ARTIFACTS: Set<ArtifactType> = new Set([
  ArtifactType.EXECUTION_PACK,
  ArtifactType.EXECUTION_RESULT,
  ArtifactType.RUNSTATE,
  ArtifactType.VERIFICATION_RECORD,
  ArtifactType.CONTINUATION_STATE,
  ArtifactType.PROJECT_LINK,
  ArtifactType.DECISION_REQUEST,
  ArtifactType.DAILY_REVIEW_PACK,
]);

export interface RoutingResult {
  artifactType: ArtifactType;
  targetPath: string;
  ownership: string;
  isProductOwned: boolean;
  warnings: string[];
}

function isProductOwned(artifactType: ArtifactType): boolean {
  return PRODUCT_OWNED_ARTIFACTS.has(artifactType);
}

function isOrchestrationOwned(artifactType: ArtifactType): boolean {
  return ORCHESTRATION_OWNED_ARTIFACTS.has(artifactType);
}

function routeArtifact(
  artifactType: ArtifactType,
  projectPath: string,
  relativePath?: string
): RoutingResult {
  const warnings: string[] = [];
  const context = loadProjectLink(projectPath);

  let targetRepo: string;
  let ownership: string;

  if (isProductOwned(artifactType)) {
    if (context && context.ownershipMode === OwnershipMode.MANAGED_EXTERNAL) {
      targetRepo = getProductRepoPath(projectPath);
      ownership = "product";
    } else {
      targetRepo = projectPath;
      ownership = "product (self_hosted)";
    }
  } else if (isOrchestrationOwned(artifactType)) {
    targetRepo = getOrchestrationRepoPath(projectPath);
    ownership = "orchestration";
  } else {
    targetRepo = projectPath;
    ownership = "unknown";
    warnings.push(`Unknown artifact type: ${artifactType}`);
  }

  let targetPath = targetRepo;
  if (relativePath) {
    targetPath = `${targetRepo}/${relativePath}`;
  }

  return {
    artifactType,
    targetPath,
    ownership,
    isProductOwned: isProductOwned(artifactType),
    warnings,
  };
}

function getFeatureSpecPath(projectPath: string, featureId: string): string {
  const result = routeArtifact(
    ArtifactType.FEATURE_SPEC,
    projectPath,
    `docs/features/${featureId}/feature-spec.md`
  );
  return result.targetPath;
}

function getExecutionPackPath(projectPath: string, executionId: string): string {
  const result = routeArtifact(
    ArtifactType.EXECUTION_PACK,
    projectPath,
    `execution-packs/${executionId}.md`
  );
  return result.targetPath;
}

function getExecutionResultPath(projectPath: string, executionId: string): string {
  const result = routeArtifact(
    ArtifactType.EXECUTION_RESULT,
    projectPath,
    `execution-results/${executionId}.md`
  );
  return result.targetPath;
}

function getRunstatePath(projectPath: string): string {
  const result = routeArtifact(
    ArtifactType.RUNSTATE,
    projectPath,
    "runstate.md"
  );
  return result.targetPath;
}

function routeNewFeature(
  projectPath: string,
  featureId: string
): { specPath: string; featureDir: string } {
  const specResult = routeArtifact(
    ArtifactType.FEATURE_SPEC,
    projectPath,
    `docs/features/${featureId}/feature-spec.md`
  );

  const featureDir = specResult.targetPath.split('/').slice(0, -1).join('/');

  return {
    specPath: specResult.targetPath,
    featureDir,
  };
}

function checkArtifactPlacement(
  projectPath: string,
  artifactType: ArtifactType,
  actualPath: string
): { isCorrect: boolean; message: string } {
  const expected = routeArtifact(artifactType, projectPath);

  if (actualPath === expected.targetPath) {
    return { isCorrect: true, message: "Artifact placed correctly" };
  }

  if (expected.isProductOwned) {
    if (isModeB(projectPath)) {
      const productRepo = getProductRepoPath(projectPath);
      if (actualPath.startsWith(productRepo)) {
        return { isCorrect: true, message: "Artifact in product repo (acceptable)" };
      }
    }
  }

  return {
    isCorrect: false,
    message: `Expected ${expected.targetPath}, found ${actualPath}`,
  };
}

function getRoutingSummary(projectPath: string): Record<string, unknown> {
  const context = loadProjectLink(projectPath);

  if (!context) {
    return {
      mode: "self_hosted",
      all_artifacts_local: true,
      product_repo: projectPath,
      orchestration_repo: projectPath,
    };
  }

  return {
    mode: context.ownershipMode,
    product_owned_count: PRODUCT_OWNED_ARTIFACTS.size,
    orchestration_owned_count: ORCHESTRATION_OWNED_ARTIFACTS.size,
    product_repo: getProductRepoPath(projectPath),
    orchestration_repo: getOrchestrationRepoPath(projectPath),
    routing_rules: {
      FeatureSpec: "Product repo (Mode B)",
      ExecutionPack: "Orchestration repo",
      ExecutionResult: "Orchestration repo",
      RunState: "Orchestration repo",
    },
  };
}

export {
  isProductOwned,
  isOrchestrationOwned,
  routeArtifact,
  getFeatureSpecPath,
  getExecutionPackPath,
  getExecutionResultPath,
  getRunstatePath,
  routeNewFeature,
  checkArtifactPlacement,
  getRoutingSummary,
};