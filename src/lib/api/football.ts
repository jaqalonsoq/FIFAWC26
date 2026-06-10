const BASE_URL = 'https://api-football-v1.p.rapidapi.com/v3'
const WC2026_LEAGUE_ID = 1

async function apiFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const key = process.env.RAPIDAPI_KEY
  if (!key || key === 'your_rapidapi_key_here') {
    throw new Error('RAPIDAPI_KEY no configurada. Copia .env.example a .env.local y añade tu key.')
  }

  const url = new URL(`${BASE_URL}${path}`)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)

  let lastError: Error | null = null
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url.toString(), {
        headers: {
          'X-RapidAPI-Key': key,
          'X-RapidAPI-Host': process.env.RAPIDAPI_HOST ?? 'api-football-v1.p.rapidapi.com',
        },
        next: { revalidate: 3600 },
      })
      if (!res.ok) throw new Error(`API-Football ${res.status}: ${await res.text()}`)
      const data = await res.json()
      return data as T
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      if (attempt < 3) await new Promise(r => setTimeout(r, attempt * 2000))
    }
  }
  throw lastError
}

interface ApiTeam {
  team: { id: number; name: string; code: string; logo: string }
}

interface ApiFixture {
  fixture: { id: number; date: string; status: { short: string } }
  teams: { home: ApiTeam['team']; away: ApiTeam['team'] }
  goals: { home: number | null; away: number | null }
  league: { round: string }
}

interface ApiPlayerStats {
  player: { id: number; name: string }
  statistics: Array<{
    team: { id: number }
    goals: { total: number | null }
    games: { appearences: number | null }
  }>
}

export async function fetchWC2026Fixtures(): Promise<ApiFixture[]> {
  const data = await apiFetch<{ response: ApiFixture[] }>('/fixtures', {
    league: String(WC2026_LEAGUE_ID),
    season: '2026',
  })
  return data.response
}

export async function fetchTopScorers(): Promise<ApiPlayerStats[]> {
  const data = await apiFetch<{ response: ApiPlayerStats[] }>('/players/topscorers', {
    league: String(WC2026_LEAGUE_ID),
    season: '2026',
  })
  return data.response
}

export async function fetchTeamStats(teamId: number): Promise<{
  avgGoalsFor: number
  avgGoalsAgainst: number
  avgCorners: number
  avgYellowCards: number
  avgRedCards: number
}> {
  const data = await apiFetch<{
    response: {
      goals: { for: { average: { total: string } }; against: { average: { total: string } } }
      cards: { yellow: Record<string, { total: number | null }>; red: Record<string, { total: number | null }> }
    }
  }>('/teams/statistics', {
    league: String(WC2026_LEAGUE_ID),
    season: '2026',
    team: String(teamId),
  })

  const r = data.response
  return {
    avgGoalsFor: parseFloat(r.goals.for.average.total) || 1.3,
    avgGoalsAgainst: parseFloat(r.goals.against.average.total) || 1.1,
    avgCorners: 5.0,
    avgYellowCards: 1.8,
    avgRedCards: 0.1,
  }
}
