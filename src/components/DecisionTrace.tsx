import type { DecisionRequest } from '../types/artifacts';

interface DecisionTraceProps {
  decisions: DecisionRequest[];
}

function DecisionTrace({ decisions }: DecisionTraceProps) {
  if (decisions.length === 0) {
    return (
      <div className="briefing-card">
        <h3 className="briefing-header">Decision History</h3>
        <p className="text-sm text-briefing-muted">No decision requests recorded</p>
      </div>
    );
  }

  const pending = decisions.filter(d => d.status === 'pending' || d.status === 'sent');
  const resolved = decisions.filter(d => d.status === 'resolved');

  return (
    <div className="briefing-card">
      <h3 className="briefing-header">Decision Email Trace</h3>
      
      {pending.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
              {pending.length} Pending
            </span>
            <span className="text-sm text-briefing-muted">Awaiting your reply</span>
          </div>
          <div className="space-y-2">
            {pending.map(decision => (
              <DecisionRequestCard key={decision.decision_request_id} decision={decision} />
            ))}
          </div>
        </div>
      )}

      {resolved.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
              {resolved.length} Resolved
            </span>
          </div>
          <div className="space-y-3">
            {resolved.slice(0, 5).map(decision => (
              <DecisionRequestCard key={decision.decision_request_id} decision={decision} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface DecisionRequestCardProps {
  decision: DecisionRequest;
}

function DecisionRequestCard({ decision }: DecisionRequestCardProps) {
  const age = decision.sent_at 
    ? Math.round((Date.now() - new Date(decision.sent_at).getTime()) / 60000)
    : 0;

  const statusColors = {
    pending: 'bg-yellow-50 border-yellow-200',
    sent: 'bg-blue-50 border-blue-200',
    reply_received: 'bg-purple-50 border-purple-200',
    resolved: 'bg-green-50 border-green-200',
    expired: 'bg-red-50 border-red-200',
  };

  const statusLabels = {
    pending: 'Awaiting Reply',
    sent: 'Email Sent',
    reply_received: 'Reply Received',
    resolved: 'Resolved',
    expired: 'Expired',
  };

  return (
    <div className={`p-3 rounded border ${statusColors[decision.status]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-briefing-secondary">
            {decision.question.slice(0, 100)}
            {decision.question.length > 100 && '...'}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-2 py-0.5 rounded text-xs ${
              decision.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
              decision.status === 'reply_received' ? 'bg-purple-100 text-purple-700' :
              decision.status === 'resolved' ? 'bg-green-100 text-green-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {statusLabels[decision.status]}
            </span>
            {age > 0 && (
              <span className="text-xs text-briefing-muted">
                {age} min ago
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-briefing-muted">{decision.decision_request_id}</p>
          {decision.recommendation && (
            <p className="text-xs text-briefing-accent">→ {decision.recommendation}</p>
          )}
        </div>
      </div>

      {decision.status === 'pending' && decision.options && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-briefing-muted mb-2">Reply format:</p>
          <p className="text-xs text-briefing-secondary">DECISION {decision.recommendation || 'A'}</p>
        </div>
      )}

      {decision.status === 'resolved' && decision.resolution && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-green-600">
            Reply: {decision.resolution}
          </p>
        </div>
      )}
    </div>
  );
}

export { DecisionTrace, DecisionRequestCard };
export type { DecisionTraceProps, DecisionRequestCardProps };