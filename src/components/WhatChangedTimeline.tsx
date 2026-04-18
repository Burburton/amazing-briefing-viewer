import type { ChangeEvent, ChangeEventType } from '../types/briefing';

interface WhatChangedTimelineProps {
  events: ChangeEvent[];
}

function WhatChangedTimeline({ events }: WhatChangedTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="briefing-card">
        <h3 className="briefing-header">What Changed</h3>
        <p className="text-sm text-briefing-muted">No recent changes recorded</p>
      </div>
    );
  }

  return (
    <div className="briefing-card">
      <h3 className="briefing-header">What Changed</h3>
      <div className="mt-4 space-y-3">
        {events.slice(0, 10).map(event => (
          <ChangeEventItem key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

interface ChangeEventItemProps {
  event: ChangeEvent;
}

function ChangeEventItem({ event }: ChangeEventItemProps) {
  const typeConfig: Record<ChangeEventType, { color: string; icon: string; label: string }> = {
    feature_complete: { color: 'green', icon: '✓', label: 'Feature Complete' },
    execution_success: { color: 'green', icon: '→', label: 'Progress' },
    execution_failed: { color: 'red', icon: '✗', label: 'Failed' },
    blocker_added: { color: 'red', icon: '!', label: 'Blocker' },
    blocker_resolved: { color: 'green', icon: '✓', label: 'Resolved' },
    decision_requested: { color: 'yellow', icon: '?', label: 'Decision Needed' },
    decision_resolved: { color: 'green', icon: '✓', label: 'Decision Made' },
    phase_change: { color: 'blue', icon: '↻', label: 'Phase Change' },
  };

  const config = typeConfig[event.type];

  return (
    <div className="flex items-start gap-3 p-2 bg-gray-50 rounded">
      <span className={`text-${config.color}-500 font-bold`}>{config.icon}</span>
      <div className="flex-1">
        <p className="text-sm text-briefing-secondary">{event.description}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-briefing-muted">{config.label}</span>
          {event.execution_id && (
            <span className="text-xs text-briefing-accent">{event.execution_id}</span>
          )}
        </div>
      </div>
      <span className="text-xs text-briefing-muted">{event.timestamp}</span>
    </div>
  );
}

export { WhatChangedTimeline };