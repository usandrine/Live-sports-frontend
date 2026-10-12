export function formatDate(dateString: string | null): string {
  if (!dateString) return 'TBD';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatMatchTime(startTime: string | null): string {
  if (!startTime) return 'TBD';
  const date = new Date(startTime);
  const now = new Date();
  const diff = date.getTime() - now.getTime();

  if (diff < 0) return 'Started';
  if (diff < 60000) return 'Starting soon';
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `In ${minutes}m`;
  }
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `In ${hours}h`;
  }

  return formatDate(startTime);
}

export function calculateLiveMinute(startTime: string | null, endTime: string | null): number | null {
  if (!startTime) return null;
  const start = new Date(startTime);
  const now = new Date();
  
  // If match hasn't started yet
  if (now < start) return null;
  
  // If match has ended
  if (endTime && now >= new Date(endTime)) return null;
  
  // Calculate minutes elapsed since start
  const diffMs = now.getTime() - start.getTime();
  const minutes = Math.floor(diffMs / 60000);
  
  return minutes;
}

export function getSportIcon(sport: string): string {
  const sportMap: Record<string, string> = {
    football: '⚽',
    soccer: '⚽',
    basketball: '🏀',
    cricket: '🏏',
    tennis: '🎾',
    baseball: '⚾',
    hockey: '🏒',
    rugby: '🏉',
  };
  return sportMap[sport.toLowerCase()] || '🏆';
}

export function getStatusBadge(status: string) {
  switch (status) {
    case 'live':
      return 'live-badge';
    case 'scheduled':
      return 'scheduled-badge';
    case 'finished':
      return 'finished-badge';
    default:
      return 'finished-badge';
  }
}
