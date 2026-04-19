import type { BriefingSummary, StateSnapshot } from '../types/briefing';
import { StatusBadge } from './StatusBadge';
import { SkeletonCard, ErrorMessage, EmptyBriefing } from './StateComponents';

interface ExecutiveBriefProps {
  summary?: BriefingSummary;
  state?: StateSnapshot;
  isLoading?: boolean;
  error?: string;
}

function ExecutiveBrief({ summary, state, isLoading, error }: ExecutiveBriefProps) {
  if (error) {
    return (
      <ErrorMessage 
        message="Failed to load briefing" 
        details={error}
      />
    );
  }

  if (isLoading) {
    return <SkeletonCard />;
  }

  if (!summary || !state) {
    return <EmptyBriefing />;
  }

  const progressPercent = summary.total_features > 0 
    ? Math.round((summary.completed_features / summary.total_features) * 100)
    : 0;

  return (
    <div className="briefing-card">
      <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
        <div>
          <h1 className="text-h1">{summary.product_name}</h1>
          <p className="text-small text-briefing-muted mt-1">{summary.product_id}</p>
        </div>
        <StatusBadge status={summary.status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-tiny text-briefing-muted uppercase tracking-wide">Current Phase</p>
          <p className="text-body text-briefing-secondary font-medium capitalize">{state.phase}</p>
        </div>
        <div>
          <p className="text-tiny text-briefing-muted uppercase tracking-wide">Current Feature</p>
          <p className="text-body text-briefing-secondary font-medium">{state.feature || 'None'}</p>
        </div>
        <div>
          <p className="text-tiny text-briefing-muted uppercase tracking-wide">Last Action</p>
          <p className="text-small text-briefing-secondary">{state.last_action || 'No action recorded'}</p>
        </div>
        <div>
          <p className="text-tiny text-briefing-muted uppercase tracking-wide">Updated</p>
          <p className="text-small text-briefing-secondary">
            {state.updated_at ? new Date(state.updated_at).toLocaleString() : 'Unknown'}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-tiny text-briefing-muted uppercase tracking-wide mb-2">Feature Progress</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-briefing-accent h-2.5 rounded-full transition-all" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-small text-briefing-secondary font-medium tabular-nums">
            {summary.completed_features}/{summary.total_features}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {summary.has_blockers && (
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-tiny font-medium">
            Blockers
          </span>
        )}
        {summary.has_decisions_needed && (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-tiny font-medium">
            Decision Needed
          </span>
        )}
        {!summary.has_blockers && !summary.has_decisions_needed && (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-tiny font-medium">
            No Issues
          </span>
        )}
      </div>
    </div>
  );
}

export { ExecutiveBrief };