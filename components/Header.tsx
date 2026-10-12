'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Clock, CheckCircle } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/live', label: 'Live', icon: null },
  { href: '/upcoming', label: 'Upcoming', icon: Clock },
  { href: '/finished', label: 'Finished', icon: CheckCircle },
];

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-md supports-[backdrop-filter]:bg-ink/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link href="/" className="group flex shrink-0 items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-ink transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-105">
              <Zap className="h-5 w-5" fill="currentColor" strokeWidth={0} />
            </span>
            <span className="font-display text-2xl font-extrabold uppercase italic leading-none tracking-tight">
              Sportz<span className="text-brand">Live</span>
            </span>
          </Link>

          <nav className="flex items-center">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? 'page' : undefined}
                className={`nav-link ${isActive(href) ? 'nav-link-active' : ''}`}
              >
                {Icon ? (
                  <Icon className="hidden h-4 w-4 sm:block" />
                ) : (
                  <span className="live-dot text-brand" />
                )}
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
