const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Match {
  id: number;
  sport: string;
  championship: string;
  homeTeam: string;
  awayTeam: string;
  status: 'scheduled' | 'live' | 'finished';
  startTime: string | null;
  endTime: string | null;
  homeScore: number;
  awayScore: number;
  createdAt: string;
}

export interface Commentary {
  id: number;
  matchId: number;
  minute: number | null;
  sequence: number | null;
  period: string | null;
  eventType: string | null;
  actor: string | null;
  team: string | null;
  message: string;
  metadata: Record<string, any> | null;
  tags: string[] | null;
  createdAt: string;
}

export async function fetchMatches(limit = 50, sport?: string, status?: 'live' | 'scheduled' | 'finished'): Promise<Match[]> {
  const params = new URLSearchParams();
  params.set('limit', String(limit));
  if (sport) params.set('sport', sport);
  if (status) params.set('status', status);
  
  const response = await fetch(`${API_BASE_URL}/matches?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch matches');
  }
  const json = await response.json();
  // Backend returns { data: [...] } format
  return Array.isArray(json.data) ? json.data : json;
}

export async function fetchMatchById(id: number): Promise<Match> {
  const response = await fetch(`${API_BASE_URL}/matches`);
  if (!response.ok) {
    throw new Error('Failed to fetch matches');
  }
  const json = await response.json();
  const matches: Match[] = Array.isArray(json.data) ? json.data : json;
  const match = matches.find((m) => m.id === id);
  if (!match) {
    throw new Error('Match not found');
  }
  return match;
}

export async function fetchCommentary(matchId: number, limit = 50): Promise<Commentary[]> {
  const response = await fetch(`${API_BASE_URL}/matches/${matchId}/commentary?limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch commentary');
  }
  const json = await response.json();
  // Backend returns { data: [...] } format
  return Array.isArray(json.data) ? json.data : json;
}

export async function createCommentary(
  matchId: number,
  data: {
    message: string;
    minute?: number;
    period?: string;
    eventType?: string;
    actor?: string;
    team?: string;
    tags?: string[];
  }
): Promise<Commentary> {
  const response = await fetch(`${API_BASE_URL}/matches/${matchId}/commentary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.error || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(`Failed to create commentary: ${errorMessage}`);
  }
  const json = await response.json();
  // Backend returns { data: {...} } format
  return json.data || json;
}

export function filterMatchesByStatus(
  matches: Match[],
  status: 'live' | 'scheduled' | 'finished'
): Match[] {
  return matches.filter((m) => m.status === status);
}
