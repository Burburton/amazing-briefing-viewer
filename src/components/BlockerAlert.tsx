import type { Risk } from '../types/briefing';
import { RiskLevelBadge } from './RiskLevelBadge';

interface BlockerAlertProps {
  risks: Risk[];
}

function BlockerAlert({ risks }: BlockerAlertProps) {
  if (risks.length === 0) return null;

  const blockers = risks.filter(r => r.source === 'blocked_item');
  const issues = risks.filter(r => r.source === 'issue_found');
  const highRisks = risks.filter(r => r.level === 'high');
  const mediumRisks = risks.filter(r => r.level === 'medium');

  return (
    <div className="briefing-card border-red-200 bg-red-50">
      <div className="flex items-start gap-3">
        <div className="text-red-500 mt-0.5">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-h3 text-red-700">Risks & Blockers</h3>
            <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-tiny font-medium">
              {risks.length} total
            </span>
          </div>
          
          {highRisks.length > 0 && (
            <div className="mb-4">
              <p className="text-tiny text-briefing-muted uppercase tracking-wide mb-2">Critical (requires immediate attention)</p>
              <div className="space-y-2">
                {highRisks.map((risk, i) => (
                  <div key={i} className="bg-white p-3 rounded border border-red-200">
                    <div className="flex items-center gap-2 mb-1">
                      <RiskLevelBadge level={risk.level} />
                      <span className="text-tiny text-briefing-muted">{risk.source === 'blocked_item' ? 'Blocker' : 'Issue'}</span>
                    </div>
                    <p className="text-small font-medium text-red-700">{risk.item}</p>
                    <p className="text-tiny text-red-600 mt-1">{risk.reason}</p>
                    <p className="text-tiny text-briefing-muted mt-2 italic">
                      Suggestion: Review this item before continuing execution
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {mediumRisks.length > 0 && (
            <div>
              <p className="text-tiny text-briefing-muted uppercase tracking-wide mb-2">Warnings (monitor)</p>
              <ul className="space-y-1">
                {mediumRisks.slice(0, 3).map((risk, i) => (
                  <li key={i} className="flex items-center gap-2 p-2 bg-white rounded">
                    <RiskLevelBadge level={risk.level} />
                    <span className="text-small text-briefing-secondary">{risk.item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {blockers.length === 0 && issues.length === 0 && (
            <p className="text-small text-briefing-muted">No active blockers or issues</p>
          )}
        </div>
      </div>
    </div>
  );
}

export { BlockerAlert };