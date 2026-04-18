import type { Risk } from '../types/briefing';

interface BlockerAlertProps {
  risks: Risk[];
}

function BlockerAlert({ risks }: BlockerAlertProps) {
  if (risks.length === 0) return null;

  const blockers = risks.filter(r => r.source === 'blocked_item');
  const issues = risks.filter(r => r.source === 'issue_found');

  return (
    <div className="briefing-card border-red-200 bg-red-50">
      <div className="flex items-start gap-3">
        <div className="text-red-500 mt-1">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="briefing-header text-red-700">Risks & Blockers</h3>
          
          {blockers.length > 0 && (
            <div className="mt-3 space-y-2">
              {blockers.map((blocker, i) => (
                <div key={i} className="bg-white p-2 rounded border border-red-100">
                  <p className="text-sm font-medium text-red-700">{blocker.item}</p>
                  <p className="text-xs text-red-600">{blocker.reason}</p>
                </div>
              ))}
            </div>
          )}
          
          {issues.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-briefing-muted mb-2">Recent Issues:</p>
              <ul className="space-y-1">
                {issues.slice(0, 3).map((issue, i) => (
                  <li key={i} className="text-sm text-briefing-secondary">
                    • {issue.item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { BlockerAlert };