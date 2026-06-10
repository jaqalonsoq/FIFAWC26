import { getDb } from '../db/schema'
import { WC2026_TEAMS, GROUPS } from './wc2026-teams'
import { upsertTeam } from '../db/queries'

function groupMatches(group: string, teams: typeof WC2026_TEAMS, startId: number, baseDate: string, venues: string[]): Array<{
  id: number; homeCode: string; awayCode: string; date: string; stage: string; group: string; venue: string
}> {
  const [t1, t2, t3, t4] = teams
  const pairs = [
    [t1, t2], [t3, t4],
    [t1, t3], [t2, t4],
    [t1, t4], [t2, t3],
  ] as const
  const dates = [baseDate, baseDate, addDays(baseDate, 3), addDays(baseDate, 3), addDays(baseDate, 6), addDays(baseDate, 6)]
  return pairs.map(([h, a], i) => ({
    id: startId + i,
    homeCode: h.code,
    awayCode: a.code,
    date: dates[i],
    stage: `Grupo ${group}`,
    group,
    venue: venues[i % venues.length],
  }))
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

const VENUE_MAP: Record<string, string[]> = {
  A: ['Estadio Azteca, CDMX', 'Estadio Akron, GDL', 'Estadio BBVA, MTY'],
  B: ['MetLife Stadium, NJ', 'AT&T Stadium, TX', 'SoFi Stadium, CA'],
  C: ['Levi\'s Stadium, CA', 'Rose Bowl, CA', 'Lincoln Financial Field, PA'],
  D: ['AT&T Stadium, TX', 'Empower Field, CO', 'Estadio Azteca, CDMX'],
  E: ['SoFi Stadium, CA', 'Gillette Stadium, MA', 'MetLife Stadium, NJ'],
  F: ['Rose Bowl, CA', 'AT&T Stadium, TX', 'Estadio BBVA, MTY'],
  G: ['Lincoln Financial Field, PA', 'Levi\'s Stadium, CA', 'BC Place, Vancouver'],
  H: ['BC Place, Vancouver', 'BMO Field, Toronto', 'Mercedes-Benz Stadium, GA'],
  I: ['Camping World Stadium, FL', 'Mercedes-Benz Stadium, GA', 'BMO Field, Toronto'],
  J: ['MetLife Stadium, NJ', 'Gillette Stadium, MA', 'Empower Field, CO'],
  K: ['Estadio Akron, GDL', 'Estadio BBVA, MTY', 'BC Place, Vancouver'],
  L: ['BMO Field, Toronto', 'Camping World Stadium, FL', 'SoFi Stadium, CA'],
}

const GROUP_START_DATES: Record<string, string> = {
  A: '2026-06-11', B: '2026-06-12', C: '2026-06-13', D: '2026-06-14',
  E: '2026-06-15', F: '2026-06-16', G: '2026-06-17', H: '2026-06-18',
  I: '2026-06-19', J: '2026-06-20', K: '2026-06-21', L: '2026-06-22',
}

export function seedDatabase() {
  const db = getDb()

  const teamCount = (db.prepare('SELECT COUNT(*) as cnt FROM teams').get() as { cnt: number }).cnt
  if (teamCount > 0) return

  for (const team of WC2026_TEAMS) {
    upsertTeam(team)
  }

  const teamByCode = Object.fromEntries(WC2026_TEAMS.map(t => [t.code, t]))
  const insertMatch = db.prepare(`
    INSERT OR IGNORE INTO matches (id, home_team_id, away_team_id, match_date, stage, grp, venue)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  let matchId = 1
  for (const group of GROUPS) {
    const teams = WC2026_TEAMS.filter(t => t.group === group)
    const matches = groupMatches(group, teams, matchId, GROUP_START_DATES[group], VENUE_MAP[group])
    for (const m of matches) {
      const home = teamByCode[m.homeCode]
      const away = teamByCode[m.awayCode]
      if (!home || !away) continue
      insertMatch.run(m.id, home.id, away.id, m.date, m.stage, m.group, m.venue)
    }
    matchId += 6
  }
}
