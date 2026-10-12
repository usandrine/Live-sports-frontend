'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchMatches, filterMatchesByStatus, Match } from '@/lib/api';
import MatchCard from '@/components/MatchCard';
import SportFilter from '@/components/SportFilter';
import { wsClient } from '@/lib/websocket';
import { RefreshCw, RadioTower } from 'lucide-react';
import { PageHeader, MatchGridSkeleton, EmptyState, ErrorState } from '@/components/StateViews';
import Link from 'next/link';
import { calculateLiveMinute } from '@/lib/utils';

export default function LiveMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liveMinutes, setLiveMinutes] = useState<Record<number, number>>({});
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const matchesRef = useRef(matches);
  const subscribedIdsRef = useRef<Set<number>>(new Set());

  // Keep ref in sync
  useEffect(() => {
    matchesRef.current = matches;
  }, [matches]);

  const loadMatches = useCallback(async () => {
    try {
      const allMatches = await fetchMatches(100, selectedSport ?? undefined, 'live');
      setMatches(allMatches);
      setError(null);
    } catch (err) {
      setError('Failed to load matches');
      console.error(err);
    }
  }, [selectedSport]);

  const syncMatchStatus = useCallback(async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/matches/sync-status`, {
        method: 'POST',
      });
      // After sync, reload matches silently (no loading state)
      const refreshedMatches = await fetchMatches(100, selectedSport ?? undefined, 'live');
      setMatches(refreshedMatches);
    } catch (err) {
      console.error('Failed to sync match status:', err);
    }
  }, [selectedSport]);

  // Manage WebSocket subscriptions
  const manageSubscriptions = useCallback((currentMatches: Match[]) => {
    const currentIds = new Set(currentMatches.map((m) => m.id));
    const prevIds = subscribedIdsRef.current;

    // Unsubscribe from matches no longer in the list
    prevIds.forEach((id) => {
      if (!currentIds.has(id)) {
        wsClient.unsubscribe(id);
        prevIds.delete(id);
      }
    });

    // Subscribe to new matches
    currentIds.forEach((id) => {
      if (!prevIds.has(id)) {
        wsClient.subscribe(id);
        prevIds.add(id);
      }
    });
  }, []);

  useEffect(() => {
    // Reload matches when sport filter changes
    const initialize = async () => {
      setLoading(true);
      await loadMatches();
      setLoading(false);
    };
    initialize();
  }, [selectedSport, loadMatches]);

  useEffect(() => {
    // Connect to WebSocket for real-time updates
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';
    wsClient.connect(wsUrl);

    // Listen for match updates
    const unsubscribe = wsClient.onMatchUpdate((data) => {
      setMatches((prev) => {
        const exists = prev.find((m) => m.id === data.id);
        if (exists) {
          return prev.map((m) => (m.id === data.id ? data : m));
        }
        if (data.status === 'live') {
          return [data, ...prev];
        }
        return prev;
      });
    });

    // Subscribe to new live matches whenever matches change
    const subscriptionInterval = setInterval(() => {
      manageSubscriptions(matchesRef.current);
    }, 2000);

    // Update live minutes every second (fast updates for minute display)
    const minuteInterval = setInterval(() => {
      setLiveMinutes((prev) => {
        const newMinutes: Record<number, number> = {};
        matchesRef.current.forEach((match) => {
          const minute = calculateLiveMinute(match.startTime, match.endTime);
          if (minute !== null) {
            newMinutes[match.id] = minute;
          }
        });
        return newMinutes;
      });
    }, 1000);

    // Sync match status every 30 seconds (silent background sync)
    const syncInterval = setInterval(() => {
      syncMatchStatus();
    }, 30000);

    return () => {
      unsubscribe();
      subscribedIdsRef.current.forEach((matchId) => {
        wsClient.unsubscribe(matchId);
      });
      clearInterval(minuteInterval);
      clearInterval(syncInterval);
      clearInterval(subscriptionInterval);
    };
  }, [loadMatches, syncMatchStatus, manageSubscriptions]);

  const header = (
    <PageHeader
      eyebrow={
        <span className="live-badge">
          <span className="live-dot" />
          Live now
        </span>
      }
      title="Live Matches"
      subtitle="Watch matches happening right now"
      count={loading && matches.length === 0 ? undefined : matches.length}
    />
  );

  if (error) {
    return (
      <ErrorState
        message={error}
        action={
          <button onClick={loadMatches} className="btn-primary">
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        }
      />
    );
  }

  return (
    <div>
      {header}

      <SportFilter selectedSport={selectedSport} onSportChange={setSelectedSport} />

      {loading && matches.length === 0 ? (
        <MatchGridSkeleton />
      ) : matches.length === 0 ? (
        <EmptyState
          icon={RadioTower}
          title="No live matches at the moment"
          description="Check back later or browse upcoming matches"
          action={
            <Link href="/upcoming" className="btn-ghost">
              See upcoming
            </Link>
          }
        />
      ) : (
        <div
          className={`match-grid transition-opacity duration-200 ${loading ? 'opacity-50' : ''}`}
        >
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              liveMinute={liveMinutes[match.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
