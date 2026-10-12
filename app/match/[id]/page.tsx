'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { fetchMatchById, fetchCommentary, createCommentary, Match, Commentary } from '@/lib/api';
import { wsClient } from '@/lib/websocket';
import { getSportIcon, getStatusBadge, formatDate } from '@/lib/utils';
import { ArrowLeft, Send, MessageSquare, CalendarClock, Flag } from 'lucide-react';
import Link from 'next/link';
import CommentaryItem from '@/components/CommentaryItem';
import AnimatedScore from '@/components/AnimatedScore';
import TeamBadge from '@/components/TeamBadge';
import { ErrorState, EmptyState } from '@/components/StateViews';

export default function MatchDetailPage() {
  const params = useParams();
  const matchId = Number(params.id);

  const [match, setMatch] = useState<Match | null>(null);
  const [commentary, setCommentary] = useState<Commentary[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const commentaryListRef = useRef<HTMLDivElement>(null);

  // Newest first; the same comment can arrive from both the POST response and the WebSocket
  const addComment = (comment: Commentary) => {
    setCommentary((prev) =>
      prev.some((c) => c.id === comment.id) ? prev : [comment, ...prev]
    );
    setTimeout(() => {
      commentaryListRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const loadMatch = async () => {
    try {
      setLoading(true);
      const matchData = await fetchMatchById(matchId);
      setMatch(matchData);
      setError(null);
    } catch (err) {
      setError('Failed to load match');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCommentary = async () => {
    try {
      const commentaryData = await fetchCommentary(matchId, 100);
      setCommentary(commentaryData);
    } catch (err) {
      console.error('Failed to load commentary:', err);
    }
  };

  useEffect(() => {
    loadMatch();
    loadCommentary();

    // Connect to WebSocket
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';
    wsClient.connect(wsUrl);

    // Subscribe to this match
    wsClient.subscribe(matchId);

    // Listen for commentary updates
    const unsubscribe = wsClient.onCommentary((data) => {
      if (data.matchId === matchId) addComment(data);
    });

    return () => {
      unsubscribe();
      wsClient.unsubscribe(matchId);
    };
  }, [matchId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const created = await createCommentary(matchId, {
        message: newComment.trim(),
      });
      addComment(created);
      setNewComment('');
    } catch (err) {
      console.error('Failed to post comment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to post comment';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl" aria-busy="true" aria-label="Loading match details">
        <div className="skeleton mb-5 h-5 w-36" />
        <div className="surface mb-6 p-6 sm:p-8">
          <div className="mb-8 flex justify-between">
            <div className="skeleton h-4 w-40" />
            <div className="skeleton h-6 w-16" />
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="flex flex-col items-center gap-3">
              <div className="skeleton h-16 w-16 rounded-full sm:h-20 sm:w-20" />
              <div className="skeleton h-4 w-24" />
            </div>
            <div className="skeleton h-14 w-32 sm:h-20 sm:w-44" />
            <div className="flex flex-col items-center gap-3">
              <div className="skeleton h-16 w-16 rounded-full sm:h-20 sm:w-20" />
              <div className="skeleton h-4 w-24" />
            </div>
          </div>
        </div>
        <div className="surface p-6">
          <div className="skeleton mb-5 h-6 w-32" />
          <div className="skeleton mb-6 h-11 w-full" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="mb-4 flex gap-3">
              <div className="skeleton h-9 w-9 shrink-0 rounded-full" />
              <div className="skeleton h-16 flex-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <ErrorState
        message={error || 'Match not found'}
        action={
          <Link href="/live" className="btn-primary">
            <ArrowLeft className="h-4 w-4" />
            Back to Live Matches
          </Link>
        }
      />
    );
  }

  const sportIcon = getSportIcon(match.sport);
  const statusBadge = getStatusBadge(match.status);
  const isLive = match.status === 'live';
  const isScheduled = match.status === 'scheduled';
  const isFinished = match.status === 'finished';
  const homeLost = isFinished && match.homeScore < match.awayScore;
  const awayLost = isFinished && match.awayScore < match.homeScore;

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/live"
        className="group mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
        Back to Matches
      </Link>

      {/* Match Header / Score Board */}
      <section
        className={`surface relative mb-6 overflow-hidden p-5 sm:p-8 ${
          isLive ? 'border-brand/30' : ''
        }`}
      >
        {isLive && (
          <>
            <div className="absolute inset-x-0 top-0 h-[3px] bg-brand" aria-hidden="true" />
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,210,31,0.08),transparent)]"
              aria-hidden="true"
            />
          </>
        )}

        <div className="relative mb-6 flex items-center justify-between gap-3 sm:mb-8">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-700 text-lg">
              {sportIcon}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold uppercase tracking-wider text-white/80">
                {match.championship}
              </p>
              <p className="text-[11px] capitalize text-muted">{match.sport}</p>
            </div>
          </div>
          <span className={statusBadge}>
            {isLive && <span className="live-dot" />}
            {isLive ? 'LIVE' : match.status.toUpperCase()}
          </span>
        </div>

        <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
          <div className="flex min-w-0 flex-col items-center gap-3 text-center">
            <TeamBadge name={match.homeTeam} size="lg" />
            <p
              className={`line-clamp-2 text-base font-bold sm:text-xl ${
                homeLost ? 'text-zinc-500' : 'text-white'
              }`}
            >
              {match.homeTeam}
            </p>
          </div>

          <div className="flex flex-col items-center">
            {isScheduled ? (
              <span className="font-display text-4xl font-bold uppercase text-zinc-600 sm:text-5xl">
                vs
              </span>
            ) : (
              <div className="flex items-center gap-2 font-display text-6xl font-extrabold leading-none sm:gap-4 sm:text-8xl">
                <AnimatedScore
                  value={match.homeScore}
                  className={homeLost ? 'text-zinc-500' : 'text-white'}
                />
                <span className="text-4xl text-zinc-600 sm:text-6xl">:</span>
                <AnimatedScore
                  value={match.awayScore}
                  className={awayLost ? 'text-zinc-500' : 'text-white'}
                />
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-col items-center gap-3 text-center">
            <TeamBadge name={match.awayTeam} size="lg" />
            <p
              className={`line-clamp-2 text-base font-bold sm:text-xl ${
                awayLost ? 'text-zinc-500' : 'text-white'
              }`}
            >
              {match.awayTeam}
            </p>
          </div>
        </div>

        {isScheduled && (
          <div className="relative mt-6 flex items-center justify-center gap-1.5 text-sm text-muted">
            <CalendarClock className="h-4 w-4" />
            <p>Starts: {formatDate(match.startTime)}</p>
          </div>
        )}

        {isFinished && (
          <div className="relative mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-muted">
            <Flag className="h-4 w-4" />
            <p>Full Time</p>
          </div>
        )}
      </section>

      {/* Commentary Section */}
      <section className="surface p-4 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
            Commentary
          </h2>
          {commentary.length > 0 && (
            <span className="rounded-full border border-line bg-ink-700 px-2.5 py-1 text-xs font-semibold tabular-nums text-muted">
              {commentary.length} {commentary.length === 1 ? 'update' : 'updates'}
            </span>
          )}
        </div>

        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="input flex-1"
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="btn-primary shrink-0"
              aria-label="Post comment"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Post</span>
            </button>
          </div>
        </form>

        {/* Commentary List */}
        <div ref={commentaryListRef} className="-mr-2 max-h-[32rem] overflow-y-auto pr-2">
          {commentary.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No commentary yet"
              description="Be the first to comment!"
            />
          ) : (
            commentary.map((item) => (
              <CommentaryItem key={item.id} commentary={item} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
