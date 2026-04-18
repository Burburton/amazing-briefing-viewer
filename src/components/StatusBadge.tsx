import type { ProjectStatus } from '../types/briefing';

interface StatusBadgeProps {
  status: ProjectStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const colors: Record<ProjectStatus, string> = {
    active: 'bg-green-100 text-green-800 border-green-200',
    paused: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    blocked: 'bg-red-100 text-red-800 border-red-200',
    completed: 'bg-blue-100 text-blue-800 border-blue-200',
    unknown: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const labels: Record<ProjectStatus, string> = {
    active: 'Active',
    paused: 'Paused',
    blocked: 'Blocked',
    completed: 'Completed',
    unknown: 'Unknown',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[status]}`}>
      {labels[status]}
    </span>
  );
}

export { StatusBadge };