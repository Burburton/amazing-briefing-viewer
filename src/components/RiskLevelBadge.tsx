import type { RiskLevel } from '../types/briefing';

interface RiskLevelBadgeProps {
  level: RiskLevel;
}

function RiskLevelBadge({ level }: RiskLevelBadgeProps) {
  const config: Record<RiskLevel, { bg: string; text: string; label: string }> = {
    high: { bg: 'bg-red-100', text: 'text-red-700', label: 'High' },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Medium' },
    low: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Low' },
  };

  const c = config[level];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

export { RiskLevelBadge };