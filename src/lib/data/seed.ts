import { getDb } from '../db/schema'
import { WC2026_TEAMS } from './wc2026-teams'
import { upsertTeam } from '../db/queries'

interface MatchSeed {
  id: number
  homeCode: string
  awayCode: string
  date: string
  stage: string
  group: string | null
  venue: string
}

const GROUP_MATCHES: MatchSeed[] = [
  { id: 1, homeCode: 'ARG', awayCode: 'ECU', date: '2026-06-11', stage: 'Grupo A', group: 'A', venue: 'MetLife Stadium, NJ' },
  { id: 2, homeCode: 'FRA', awayCode: 'PER', date: '2026-06-11', stage: 'Grupo A', group: 'A', venue: 'AT&T Stadium, TX' },
  { id: 3, homeCode: 'ESP', awayCode: 'BEL', date: '2026-06-12', stage: 'Grupo B', group: 'B', venue: 'SoFi Stadium, CA' },
  { id: 4, homeCode: 'BRA', awayCode: 'SUI', date: '2026-06-12', stage: 'Grupo B', group: 'B', venue: 'Rose Bowl, CA' },
  { id: 5, homeCode: 'ENG', awayCode: 'CRO', date: '2026-06-13', stage: 'Grupo C', group: 'C', venue: 'Levi\'s Stadium, CA' },
  { id: 6, homeCode: 'POR', awayCode: 'DEN', date: '2026-06-13', stage: 'Grupo C', group: 'C', venue: 'Lincoln Financial Field, PA' },
  { id: 7, homeCode: 'GER', awayCode: 'ITA', date: '2026-06-14', stage: 'Grupo D', group: 'D', venue: 'Gillette Stadium, MA' },
  { id: 8, homeCode: 'NED', awayCode: 'AUT', date: '2026-06-14', stage: 'Grupo D', group: 'D', venue: 'Empower Field, CO' },
  { id: 9, homeCode: 'COL', awayCode: 'CHI', date: '2026-06-15', stage: 'Grupo E', group: 'E', venue: 'Estadio Azteca, CDMX' },
  { id: 10, homeCode: 'URU', awayCode: 'PAR', date: '2026-06-15', stage: 'Grupo E', group: 'E', venue: 'Estadio BBVA, MTY' },
  { id: 11, homeCode: 'MEX', awayCode: 'CAN', date: '2026-06-16', stage: 'Grupo F', group: 'F', venue: 'Estadio Akron, GDL' },
  { id: 12, homeCode: 'USA', awayCode: 'CRC', date: '2026-06-16', stage: 'Grupo F', group: 'F', venue: 'SoFi Stadium, CA' },
  { id: 13, homeCode: 'MAR', awayCode: 'NGA', date: '2026-06-17', stage: 'Grupo G', group: 'G', venue: 'BC Place, Vancouver' },
  { id: 14, homeCode: 'SEN', awayCode: 'GHA', date: '2026-06-17', stage: 'Grupo G', group: 'G', venue: 'BMO Field, Toronto' },
  { id: 15, homeCode: 'JPN', awayCode: 'AUS', date: '2026-06-18', stage: 'Grupo H', group: 'H', venue: 'Camping World Stadium, FL' },
  { id: 16, homeCode: 'KOR', awayCode: 'KSA', date: '2026-06-18', stage: 'Grupo H', group: 'H', venue: 'Mercedes-Benz Stadium, GA' },
]

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

  for (const m of GROUP_MATCHES) {
    const home = teamByCode[m.homeCode]
    const away = teamByCode[m.awayCode]
    if (!home || !away) continue
    insertMatch.run(m.id, home.id, away.id, m.date, m.stage, m.group, m.venue)
  }
}
