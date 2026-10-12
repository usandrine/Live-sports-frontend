import { AlertCircle, LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  eyebrow?: React.ReactNode;
  title: string;
  subtitle: string;
  count?: number;
}

export function PageHeader({ eyebrow, title, subtitle, count }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <div className="mb-2">{eyebrow}</div>}
        <h1 className="font-display text-3xl font-extrabold uppercase leading-none tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted sm:text-base">{subtitle}</p>
      </div>
      {count !== undefined && (
        <div className="hidden shrink-0 text-right sm:block">
          <div className="font-display text-4xl font-bold leading-none text-brand tabular-nums">
            {count}
          </div>
          <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
            {count === 1 ? 'Match' : 'Matches'}
          </div>
        </div>
      )}
    </div>
  );
}

function MatchCardSkeleton() {
  return (
    <div className="surface p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="skeleton h-6 w-6 rounded-full" />
          <div className="skeleton h-3 w-28" />
        </div>
        <div className="skeleton h-5 w-14" />
      </div>
      {[0, 1].map((i) => (
        <div key={i} className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-3">
            <div className="skeleton h-8 w-8 rounded-full" />
            <div className="skeleton h-4 w-32" />
          </div>
          <div className="skeleton h-7 w-7" />
        </div>
      ))}
      <div className="mt-3 border-t border-line pt-3">
        <div className="skeleton mx-auto h-3 w-24" />
      </div>
    </div>
  );
}

export function MatchGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="match-grid" aria-busy="true" aria-label="Loading matches">
      {Array.from({ length: count }).map((_, i) => (
        <MatchCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="mb-6">
      <div className="skeleton h-10 w-56 sm:h-12" />
      <div className="skeleton mt-3 h-4 w-64" />
    </div>
  );
}

export function FilterSkeleton() {
  return (
    <div className="mb-6 flex gap-2">
      {[64, 96, 104, 84].map((w, i) => (
        <div key={i} className="skeleton h-9 rounded-full" style={{ width: w }} />
      ))}
    </div>
  );
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="surface flex animate-fade-up flex-col items-center px-6 py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-ink-700">
        <Icon className="h-5 w-5 text-brand" />
      </div>
      <p className="font-semibold text-white">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  action: React.ReactNode;
}

export function ErrorState({ message, action }: ErrorStateProps) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="surface flex max-w-sm animate-fade-up flex-col items-center px-8 py-10 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-loss/30 bg-loss/10">
          <AlertCircle className="h-6 w-6 text-loss" />
        </div>
        <p className="font-semibold text-white">{message}</p>
        <p className="mt-1 text-sm text-muted">Check your connection and try again.</p>
        <div className="mt-5">{action}</div>
      </div>
    </div>
  );
}
