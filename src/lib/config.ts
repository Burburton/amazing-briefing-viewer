import type { LoadedArtifacts } from '../types/artifacts';
import type { ProjectConfig } from './loader';
import { loadProject } from './loader';

const DEFAULT_ASYNC_DEV_PATH = 'G:/Workspace/amazing-async-dev';
const DEFAULT_PRODUCT_PATH = 'G:/Workspace/amazing-briefing-viewer';

function getDefaultConfig(): ProjectConfig {
  return {
    productRepoPath: DEFAULT_PRODUCT_PATH,
    asyncDevRepoPath: DEFAULT_ASYNC_DEV_PATH,
    productId: 'demo-product',
  };
}

async function loadDemoProject(): Promise<LoadedArtifacts> {
  return loadProject(getDefaultConfig());
}

function createConfig(
  productRepoPath: string,
  asyncDevRepoPath: string,
  productId: string
): ProjectConfig {
  return {
    productRepoPath,
    asyncDevRepoPath,
    productId,
  };
}

export { getDefaultConfig, loadDemoProject, createConfig };