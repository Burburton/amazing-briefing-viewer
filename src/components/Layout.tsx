import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function Layout({ children, title, subtitle }: LayoutProps) {
  return (
    <div className="min-h-screen bg-briefing-surface">
      <header className="bg-briefing-primary text-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              {title && <h1 className="font-briefing text-xl sm:text-2xl">{title}</h1>}
              {subtitle && <p className="text-sm opacity-80 mt-1">{subtitle}</p>}
            </div>
            <nav className="hidden sm:flex space-x-4 text-sm">
              <a href="#" className="hover:opacity-80 transition-opacity">Briefing</a>
              <a href="#" className="hover:opacity-80 transition-opacity">Evidence</a>
              <a href="#" className="hover:opacity-80 transition-opacity">Decisions</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      <footer className="border-t border-briefing-border bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-briefing-muted">
            amazing-briefing-viewer • Built for async-dev ecosystem
          </p>
        </div>
      </footer>
    </div>
  );
}

interface LayoutGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3;
}

export function LayoutGrid({ children, columns = 2 }: LayoutGridProps) {
  const gridClasses = {
    1: 'grid grid-cols-1 gap-6',
    2: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
    3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  };

  return (
    <div className={gridClasses[columns]}>
      {children}
    </div>
  );
}

interface LayoutSectionProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function LayoutSection({ children, title, className = '' }: LayoutSectionProps) {
  return (
    <section className={`space-y-4 ${className}`}>
      {title && (
        <h2 className="text-briefing-primary font-semibold text-lg border-b border-briefing-border pb-2">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

interface LayoutCardProps {
  children: ReactNode;
  title?: string;
  priority?: 'critical' | 'important' | 'info';
  className?: string;
}

export function LayoutCard({ children, title, priority = 'info', className = '' }: LayoutCardProps) {
  const priorityBorder = {
    critical: 'border-red-300 bg-red-50',
    important: 'border-blue-300 bg-blue-50',
    info: 'border-briefing-border bg-white',
  };

  return (
    <div className={`briefing-card ${priorityBorder[priority]} ${className}`}>
      {title && (
        <h3 className="briefing-header flex flex-wrap items-center gap-2">
          {title}
          {priority === 'critical' && (
            <span className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-700">
              Critical
            </span>
          )}
          {priority === 'important' && (
            <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700">
              Important
            </span>
          )}
        </h3>
      )}
      <div className="mt-3">
        {children}
      </div>
    </div>
  );
}