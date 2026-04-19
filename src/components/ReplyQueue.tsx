import type { DecisionRequest } from '../types/artifacts';

interface ReplyQueueProps {
  pendingDecisions: DecisionRequest[];
}

function ReplyQueue({ pendingDecisions }: ReplyQueueProps) {
  if (pendingDecisions.length === 0) {
    return (
      <div className="briefing-card border-green-200 bg-green-50">
        <div className="flex items-center gap-3">
          <div className="text-green-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 001.414 1.414l2-2a1 1 0 000-1.414l-4-4a1 1 0 00-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-h3 text-green-700">No Pending Decisions</h3>
            <p className="text-small text-green-600">All decision requests have been resolved</p>
          </div>
        </div>
      </div>
    );
  }

  const urgentThreshold = 30;
  const oldThreshold = 120;

  return (
    <div className="briefing-card border-red-200 bg-red-50">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-red-500">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-h3 text-red-700">Reply Required</h3>
          <p className="text-small text-red-600">{pendingDecisions.length} decision(s) awaiting your response</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {pendingDecisions.map(decision => {
          const ageMinutes = decision.sent_at 
            ? Math.round((Date.now() - new Date(decision.sent_at).getTime()) / 60000)
            : 0;
          
          const isUrgent = ageMinutes > urgentThreshold;
          const isOld = ageMinutes > oldThreshold;

          return (
            <div key={decision.decision_request_id} className={`p-4 rounded border ${
              isUrgent ? 'border-red-300 bg-red-100' :
              isOld ? 'border-orange-300 bg-orange-50' :
              'border-yellow-200 bg-yellow-50'
            }`}>
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2 py-1 rounded text-tiny font-medium ${
                  isUrgent ? 'bg-red-200 text-red-800' :
                  isOld ? 'bg-orange-200 text-orange-800' :
                  'bg-yellow-200 text-yellow-800'
                }`}>
                  {isUrgent ? 'URGENT' : isOld ? 'OLD' : 'PENDING'}
                </span>
                <span className="text-tiny text-briefing-muted">
                  {ageMinutes} min ago
                </span>
              </div>

              <p className="mt-2 text-small text-briefing-secondary font-medium">
                {decision.question.slice(0, 80)}
                {decision.question.length > 80 && '...'}
              </p>

              <div className="mt-3 flex gap-2">
                {decision.options?.slice(0, 4).map(opt => (
                  <ReplyActionButton
                    key={opt.id}
                    optionId={opt.id}
                    label={opt.label}
                    recommended={opt.id === decision.recommendation}
                  />
                ))}
              </div>

              <div className="mt-3 text-tiny text-briefing-muted">
                <p>Reply format: DECISION {decision.recommendation || 'A'}</p>
                <p className="mt-1">Or reply via email to: asyncdev-inbox@eawiloteno.resend.app</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ReplyActionButtonProps {
  optionId: string;
  label: string;
  recommended?: boolean;
}

function ReplyActionButton({ optionId, label, recommended }: ReplyActionButtonProps) {
  return (
    <button
      className={`px-3 py-2 rounded text-small font-medium transition-colors focus-ring ${
        recommended 
          ? 'bg-briefing-accent text-white hover:bg-blue-700' 
          : 'bg-white border border-gray-200 text-briefing-secondary hover:bg-gray-50'
      }`}
      title={recommended ? 'Recommended option' : ''}
    >
      <span className="flex items-center gap-1">
        <span className="font-bold">{optionId}:</span>
        <span>{label}</span>
        {recommended && (
          <span className="text-tiny">★</span>
        )}
      </span>
    </button>
  );
}

export { ReplyQueue, ReplyActionButton };
export type { ReplyQueueProps, ReplyActionButtonProps };