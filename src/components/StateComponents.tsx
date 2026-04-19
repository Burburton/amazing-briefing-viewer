import { ReactNode } from 'react';

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`briefing-skeleton ${className}`} />
  );
}

function SkeletonText({ className = '' }: SkeletonProps) {
  return (
    <div className={`briefing-skeleton-text ${className}`} />
  );
}

function SkeletonCard() {
  return (
    <div className="briefing-card space-y-3">
      <Skeleton className="h-6 w-1/3" />
      <SkeletonText />
      <SkeletonText className="w-1/2" />
    </div>
  );
}

function SkeletonGrid({ count = 2 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// Error State Components

interface ErrorMessageProps {
  message: string;
  retryAction?: () => void;
  retryLabel?: string;
  details?: string;
}

function ErrorMessage({ 
  message, 
  retryAction, 
  retryLabel = 'Retry',
  details 
}: ErrorMessageProps) {
  return (
    <div className="briefing-error">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <div className="flex-1">
          <p className="text-small font-medium">{message}</p>
          {details && (
            <p className="text-tiny text-red-600 mt-1">{details}</p>
          )}
          {retryAction && (
            <button 
              onClick={retryAction}
              className="mt-3 px-3 py-1.5 bg-white rounded border border-red-300 text-small text-red-700 hover:bg-red-100 transition-colors focus-ring"
            >
              {retryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Empty State Components

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

function EmptyState({ 
  title, 
  description, 
  actionLabel, 
  onAction,
  icon 
}: EmptyStateProps) {
  return (
    <div className="briefing-empty">
      {icon && (
        <div className="mb-3 text-briefing-muted">
          {icon}
        </div>
      )}
      <p className="text-body font-medium text-briefing-secondary">{title}</p>
      {description && (
        <p className="text-small text-briefing-muted mt-1">{description}</p>
      )}
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="briefing-empty-action"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function EmptyBriefing() {
  return (
    <EmptyState
      title="No briefing available"
      description="Start a new execution to generate a briefing summary."
      actionLabel="Create briefing"
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      }
    />
  );
}

function EmptyEvidence() {
  return (
    <EmptyState
      title="No evidence loaded"
      description="Run an execution to collect artifacts from product and orchestration repos."
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      }
    />
  );
}

function EmptyDecisions() {
  return (
    <EmptyState
      title="No decisions needed"
      description="All decision requests have been resolved. Check the decision history for past requests."
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
    />
  );
}

// Loading wrapper

interface LoadingWrapperProps {
  isLoading: boolean;
  children: ReactNode;
  skeleton?: ReactNode;
}

function LoadingWrapper({ isLoading, children, skeleton }: LoadingWrapperProps) {
  if (isLoading) {
    return skeleton ? <>{skeleton}</> : <SkeletonCard />;
  }
  return <>{children}</>;
}

export {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonGrid,
  ErrorMessage,
  EmptyState,
  EmptyBriefing,
  EmptyEvidence,
  EmptyDecisions,
  LoadingWrapper,
};

export type {
  SkeletonProps,
  ErrorMessageProps,
  EmptyStateProps,
  LoadingWrapperProps,
};