'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Zap } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/live');
  }, [router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center">
        <span className="relative flex h-14 w-14 items-center justify-center">
          <span className="absolute inset-0 animate-live-ping rounded-2xl bg-brand/30" />
          <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-ink">
            <Zap className="h-7 w-7" fill="currentColor" strokeWidth={0} />
          </span>
        </span>
        <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-muted">
          Loading matches…
        </p>
      </div>
    </div>
  );
}
