'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchMatches, Match } from '@/lib/api';
import MatchCard from '@/components/MatchCard';
import SportFilter from '@/components/SportFilter';
import { RefreshCw, Trophy } from 'lucide-react';
import { PageHeader, MatchGridSkeleton, EmptyState, ErrorState } from '@/components/StateViews';

export default function FinishedMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  const loadMatches = useCallback(async () => {
    try {
      setLoading(true);
      const finishedMatches = await fetchMatches(100, selectedSport ?? undefined, 'finished');
      setMatches(finishedMatches);
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
        eyebrow={<span className="finished-badge">Full time</span>}
        title="Finished Matches"
        subtitle="Results from completed matches"
        count={loading && matches.length === 0 ? undefined : matches.length}
      />

      <SportFilter selectedSport={selectedSport} onSportChange={setSelectedSport} />

      {loading && matches.length === 0 ? (
        <MatchGridSkeleton />
      ) : matches.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No finished matches yet"
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
