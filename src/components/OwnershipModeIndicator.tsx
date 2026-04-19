import { OwnershipMode } from '../lib/project-link-loader';

interface OwnershipModeIndicatorProps {
  ownershipMode: OwnershipMode;
  productRepoPath?: string | null;
}

function OwnershipModeIndicator({ ownershipMode, productRepoPath }: OwnershipModeIndicatorProps) {
  const isManagedExternal = ownershipMode === OwnershipMode.MANAGED_EXTERNAL;

  return (
    <div className="flex items-center gap-2">
      <span className={`px-2 py-1 rounded text-tiny font-medium ${
        isManagedExternal
          ? 'bg-blue-100 text-blue-700'
          : 'bg-gray-100 text-gray-700'
      }`}>
        {isManagedExternal ? 'Managed External' : 'Self-Hosted'}
      </span>

      {isManagedExternal && productRepoPath && (
        <a
          href={productRepoPath}
          className="text-tiny text-briefing-accent hover:underline focus-ring rounded"
          title="Product repository"
        >
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span className="truncate max-w-[120px]">
              {productRepoPath.split('/').pop()}
            </span>
          </span>
        </a>
      )}
    </div>
  );
}

interface ProjectContextBadgeProps {
  productId: string;
  ownershipMode: OwnershipMode;
  currentPhase?: string;
  currentFeature?: string;
}

function ProjectContextBadge({ 
  productId, 
  ownershipMode, 
  currentPhase, 
  currentFeature 
}: ProjectContextBadgeProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-tiny text-briefing-muted">
      <span className="font-medium text-briefing-secondary">{productId}</span>
      <span className="text-gray-400">•</span>
      <span className={`px-1.5 py-0.5 rounded ${
        ownershipMode === OwnershipMode.MANAGED_EXTERNAL
          ? 'bg-blue-50 text-blue-600'
          : 'bg-gray-50 text-gray-600'
      }`}>
        {ownershipMode === OwnershipMode.MANAGED_EXTERNAL ? 'Mode B' : 'Mode A'}
      </span>
      {currentPhase && (
        <>
          <span className="text-gray-400">•</span>
          <span className="capitalize">{currentPhase}</span>
        </>
      )}
      {currentFeature && (
        <>
          <span className="text-gray-400">•</span>
          <span>{currentFeature}</span>
        </>
      )}
    </div>
  );
}

export { OwnershipModeIndicator, ProjectContextBadge };
export type { OwnershipModeIndicatorProps, ProjectContextBadgeProps };