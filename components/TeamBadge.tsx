interface TeamBadgeProps {
  name: string;
  size?: 'sm' | 'lg';
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

// Monogram "logo" for teams (the API doesn't provide logo images).
export default function TeamBadge({ name, size = 'sm' }: TeamBadgeProps) {
  const sizeClasses =
    size === 'lg'
      ? 'h-16 w-16 text-xl sm:h-20 sm:w-20 sm:text-2xl'
      : 'h-8 w-8 text-[11px]';

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full border border-line-strong bg-gradient-to-b from-ink-600 to-ink-800 font-display font-bold tracking-wide text-white/90 ${sizeClasses}`}
    >
      {getInitials(name)}
    </span>
  );
}
