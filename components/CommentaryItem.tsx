import { Commentary } from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface CommentaryItemProps {
  commentary: Commentary;
}

// Events that deserve the yellow highlight treatment in the feed
const KEY_EVENTS = new Set(['goal', 'red_card', 'penalty', 'wicket', 'six', 'full_time']);

export default function CommentaryItem({ commentary }: CommentaryItemProps) {
  const getEventIcon = (eventType: string | null) => {
    if (!eventType) return '💬';

    const eventIcons: Record<string, string> = {
      goal: '⚽',
      yellow_card: '🟨',
      red_card: '🟥',
      substitution: '🔄',
      penalty: '🎯',
      corner: '🚩',
      foul: '⚠️',
      offside: '📍',
      wicket: '🏏',
      four: '4️⃣',
      six: '6️⃣',
      wide: '↔️',
      no_ball: '⚾',
      timeout: '⏸️',
      period_start: '▶️',
      period_end: '⏹️',
      match_start: '🏁',
      half_time: '⏱️',
      full_time: '🏆',
    };

    return eventIcons[eventType.toLowerCase()] || '💬';
  };

  const eventIcon = getEventIcon(commentary.eventType);
  const isKeyEvent = !!commentary.eventType && KEY_EVENTS.has(commentary.eventType.toLowerCase());

  return (
    <div className="relative flex animate-fade-up gap-3 pb-5 pl-1 last:pb-1">
      {/* Timeline rail */}
      <div className="absolute bottom-0 left-[21px] top-10 w-px bg-line" aria-hidden="true" />

      <div className="flex w-10 shrink-0 flex-col items-center">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full border text-base ${
            isKeyEvent ? 'border-brand/60 bg-brand/10' : 'border-line bg-ink-700'
          }`}
        >
          {eventIcon}
        </span>
      </div>

      <div
        className={`min-w-0 flex-1 rounded-xl border px-4 py-3 transition-colors ${
          isKeyEvent
            ? 'border-brand/30 bg-brand/[0.04]'
            : 'border-transparent hover:border-line hover:bg-ink-700/50'
        }`}
      >
        <div className="mb-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {commentary.minute && (
              <span className="font-display text-lg font-bold leading-none text-brand tabular-nums">
                {commentary.minute}&apos;
              </span>
            )}
            {commentary.period && (
              <span className="rounded border border-line px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
                {commentary.period}
              </span>
            )}
          </div>
          <span className="shrink-0 text-[11px] text-zinc-500">
            {formatDate(commentary.createdAt)}
          </span>
        </div>

        {commentary.actor && (
          <p className="mb-0.5 text-sm font-semibold text-white">
            {commentary.actor}
            {commentary.team && (
              <span className="ml-1 font-normal text-muted">({commentary.team})</span>
            )}
          </p>
        )}

        <p className="text-sm leading-relaxed text-white/85">{commentary.message}</p>

        {commentary.tags && commentary.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {commentary.tags.map((tag, index) => (
              <span
                key={index}
                className="rounded-md bg-ink-700 px-2 py-0.5 text-[11px] font-medium text-muted"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
