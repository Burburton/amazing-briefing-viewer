import type { BriefingSummary, StateSnapshot } from '../types/briefing';
import { StatusBadge } from './StatusBadge';

interface ExecutiveBriefProps {
  summary: BriefingSummary;
  state: StateSnapshot;
}

function ExecutiveBrief({ summary, state }: ExecutiveBriefProps) {
  const progressPercent = summary.total_features > 0 
    ? Math.round((summary.completed_features / summary.total_features) * 100)
    : 0;

  return (
    <div className="briefing-card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="briefing-header text-2xl">{summary.product_name}</h1>
          <p className="text-sm text-briefing-muted">{summary.product_id}</p>
        </div>
        <StatusBadge status={summary.status} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="briefing-label">Current Phase</p>
          <p className="briefing-value capitalize">{state.phase}</p>
        </div>
        <div>
          <p className="briefing-label">Current Feature</p>
          <p className="briefing-value">{state.feature || 'None'}</p>
        </div>
        <div>
          <p className="briefing-label">Last Action</p>
          <p className="briefing-value text-sm">{state.last_action || 'No action recorded'}</p>
        </div>
        <div>
          <p className="briefing-label">Updated</p>
          <p className="briefing-value text-sm">
            {state.updated_at ? new Date(state.updated_at).toLocaleString() : 'Unknown'}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="briefing-label mb-2">Feature Progress</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-briefing-accent h-2 rounded-full" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm text-briefing-muted">
            {summary.completed_features}/{summary.total_features}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {summary.has_blockers && (
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
            Blockers
          </span>
        )}
        {summary.has_decisions_needed && (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
            Decision Needed
          </span>
        )}
        {!summary.has_blockers && !summary.has_decisions_needed && (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
            No Issues
          </span>
        )}
      </div>
    </div>
  );
}

export { ExecutiveBrief };