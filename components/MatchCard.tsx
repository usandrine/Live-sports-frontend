import { Match } from '@/lib/api';
import { getSportIcon, getStatusBadge, formatDate, formatMatchTime } from '@/lib/utils';
import Link from 'next/link';
import { CalendarClock, ChevronRight, Flag, Radio } from 'lucide-react';
import AnimatedScore from './AnimatedScore';
import TeamBadge from './TeamBadge';

interface MatchCardProps {
  match: Match;
  liveMinute?: number;
}

export default function MatchCard({ match, liveMinute }: MatchCardProps) {
  const sportIcon = getSportIcon(match.sport);
  const statusBadge = getStatusBadge(match.status);
  const isLive = match.status === 'live';
  const isScheduled = match.status === 'scheduled';
  const isFinished = match.status === 'finished';

  const homeLost = isFinished && match.homeScore < match.awayScore;
  const awayLost = isFinished && match.awayScore < match.homeScore;

  const teams = [
    { name: match.homeTeam, score: match.homeScore, dimmed: homeLost },
    { name: match.awayTeam, score: match.awayScore, dimmed: awayLost },
  ];

  return (
    <Link
      href={`/match/${match.id}`}
      className={`match-card group ${isLive ? 'match-card-live' : ''}`}
    >
      {/* Competition + status */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-700 text-sm">
            {sportIcon}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-muted">
              {match.championship}
            </p>
          </div>
        </div>
        <span className={statusBadge}>
          {isLive ? (
            <>
              <span className="live-dot" />
              <span>Live</span>
              {liveMinute !== undefined && (
                <span className="tabular-nums opacity-80">{liveMinute}&apos;</span>
              )}
            </>
          ) : isScheduled ? (
            formatMatchTime(match.startTime)
          ) : (
            'FT'
          )}
        </span>
      </div>

      {/* Teams + scores */}
      <div className="space-y-2.5">
        {teams.map((team) => (
          <div key={team.name} className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <TeamBadge name={team.name} />
              <p
                className={`truncate text-[15px] font-semibold sm:text-base ${
                  team.dimmed ? 'text-zinc-500' : 'text-white'
                }`}
              >
                {team.name}
              </p>
            </div>
            <div
              className={`font-display text-3xl font-bold leading-none ${
                team.dimmed ? 'text-zinc-500' : 'text-white'
              }`}
            >
              {isScheduled ? (
                <span className="text-zinc-600">–</span>
              ) : (
                <AnimatedScore value={team.score} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer: time / status details */}
      <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          {isLive && (
            <>
              <Radio className="h-3.5 w-3.5 text-brand" />
              <span>In play · started {formatDate(match.startTime)}</span>
            </>
          )}
          {isScheduled && (
            <>
              <CalendarClock className="h-3.5 w-3.5" />
              <span>{formatDate(match.startTime)}</span>
            </>
          )}
          {isFinished && (
            <>
              <Flag className="h-3.5 w-3.5" />
              <span>Full Time</span>
            </>
          )}
        </span>
        <span className="flex items-center gap-0.5 font-semibold text-white/50 transition-colors duration-200 group-hover:text-brand">
          Details
          <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
