'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchMatches, Match } from '@/lib/api';
import MatchCard from '@/components/MatchCard';
import SportFilter from '@/components/SportFilter';
import { RefreshCw, CalendarClock } from 'lucide-react';
import { PageHeader, MatchGridSkeleton, EmptyState, ErrorState } from '@/components/StateViews';

export default function UpcomingMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  const loadMatches = useCallback(async () => {
    try {
      setLoading(true);

      // First sync status with backend
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/matches/sync-status`, {
        method: 'POST',
      });

      // Then fetch updated matches
      const upcomingMatches = await fetchMatches(100, selectedSport ?? undefined, 'scheduled');
      setMatches(upcomingMatches);
      setError(null);
    } catch (err) {
      setError('Failed to load matches');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedSport]);

  useEffect(() => {
    loadMatches();
  }, [selectedSport, loadMatches]);

  useEffect(() => {
    // Auto-refresh every 15 seconds to catch matches that just went live
    const refreshInterval = setInterval(() => {
      loadMatches();
    }, 15000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [loadMatches]);

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
      <PageHeader
        eyebrow={<span className="scheduled-badge">Up next</span>}
        title="Upcoming Matches"
        subtitle="Matches scheduled to start soon"
        count={loading && matches.length === 0 ? undefined : matches.length}
      />

      <SportFilter selectedSport={selectedSport} onSportChange={setSelectedSport} />

      {loading && matches.length === 0 ? (
        <MatchGridSkeleton />
      ) : matches.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No upcoming matches scheduled"
          description="Check back later for new matches"
        />
      ) : (
        <div className={`match-grid transition-opacity duration-200 ${loading ? 'opacity-50' : ''}`}>
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
