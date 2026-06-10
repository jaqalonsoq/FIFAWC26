import { getDb } from './schema'
import type { Match, Prediction, Team, MonteCarloOdds } from '../types'

function rowToTeam(row: Record<string, unknown>): Team {
  return {
    id: row.id as number,
    name: row.name as string,
    code: row.code as string,
    flag: row.flag as string,
    group: row.grp as string,
    elo: row.elo as number,
    avgGoalsFor: row.avg_goals_for as number,
    avgGoalsAgainst: row.avg_goals_against as number,
    avgCorners: row.avg_corners as number,
    avgYellowCards: row.avg_yellow_cards as number,
    avgRedCards: row.avg_red_cards as number,
  }
}

function rowToPrediction(row: Record<string, unknown>): Prediction {
  return {
    id: row.id as number,
    matchId: row.match_id as number,
    createdAt: row.created_at as string,
    homeWinPct: row.home_win_pct as number,
    drawPct: row.draw_pct as number,
    awayWinPct: row.away_win_pct as number,
    doubleChance1X: row.double_chance_1x as number ?? 0,
    doubleChance12: row.double_chance_12 as number ?? 0,
    doubleChanceX2: row.double_chance_x2 as number ?? 0,
    expectedHomeGoals: row.expected_home_goals as number,
    expectedAwayGoals: row.expected_away_goals as number,
    over15Pct: row.over15_pct as number ?? 0,
    over25Pct: row.over25_pct as number,
    over35Pct: row.over35_pct as number,
    bttsYesPct: row.btts_yes_pct as number,
    cleanSheetHomePct: row.clean_sheet_home_pct as number ?? 0,
    cleanSheetAwayPct: row.clean_sheet_away_pct as number ?? 0,
    expectedCorners: row.expected_corners as number,
    over85CornersPct: row.over85_corners_pct as number ?? 0,
    over105CornersPct: row.over105_corners_pct as number ?? 0,
    expectedYellowCards: row.expected_yellow_cards as number,
    over35YellowsPct: row.over35_yellows_pct as number ?? 0,
    redCardPct: row.red_card_pct as number ?? 0,
    mostLikelyScore: row.most_likely_score as string,
    topScorers: JSON.parse(row.top_scorers as string),
    scoreDistribution: JSON.parse(row.score_distribution as string),
  }
}

function matchRowToMatch(r: Record<string, unknown>): Match {
  return {
    id: r.id as number,
    homeTeamId: r.home_team_id as number,
    awayTeamId: r.away_team_id as number,
    date: r.match_date as string,
    stage: r.stage as string,
    group: r.grp as string | null,
    venue: r.venue as string,
    homeTeam: {
      id: r.ht_id as number, name: r.ht_name as string, code: r.ht_code as string,
      flag: r.ht_flag as string, group: r.ht_grp as string, elo: r.ht_elo as number,
      avgGoalsFor: r.ht_agf as number, avgGoalsAgainst: r.ht_aga as number,
      avgCorners: r.ht_ac as number, avgYellowCards: r.ht_ayc as number, avgRedCards: r.ht_arc as number,
    },
    awayTeam: {
      id: r.at_id as number, name: r.at_name as string, code: r.at_code as string,
      flag: r.at_flag as string, group: r.at_grp as string, elo: r.at_elo as number,
      avgGoalsFor: r.at_agf as number, avgGoalsAgainst: r.at_aga as number,
      avgCorners: r.at_ac as number, avgYellowCards: r.at_ayc as number, avgRedCards: r.at_arc as number,
    },
  }
}

const MATCH_JOIN_SQL = `
  SELECT m.*,
    ht.id as ht_id, ht.name as ht_name, ht.code as ht_code, ht.flag as ht_flag, ht.grp as ht_grp,
    ht.elo as ht_elo, ht.avg_goals_for as ht_agf, ht.avg_goals_against as ht_aga,
    ht.avg_corners as ht_ac, ht.avg_yellow_cards as ht_ayc, ht.avg_red_cards as ht_arc,
    at.id as at_id, at.name as at_name, at.code as at_code, at.flag as at_flag, at.grp as at_grp,
    at.elo as at_elo, at.avg_goals_for as at_agf, at.avg_goals_against as at_aga,
    at.avg_corners as at_ac, at.avg_yellow_cards as at_ayc, at.avg_red_cards as at_arc
  FROM matches m
  JOIN teams ht ON m.home_team_id = ht.id
  JOIN teams at ON m.away_team_id = at.id
`

export function getAllMatches(): Match[] {
  const db = getDb()
  const rows = db.prepare(`${MATCH_JOIN_SQL} ORDER BY m.match_date ASC`).all() as Record<string, unknown>[]
  return rows.map(matchRowToMatch)
}

export function getMatchById(id: number): Match | null {
  const db = getDb()
  const r = db.prepare(`${MATCH_JOIN_SQL} WHERE m.id = ?`).get(id) as Record<string, unknown> | undefined
  return r ? matchRowToMatch(r) : null
}

export function getMatchesByGroup(group: string): Match[] {
  const db = getDb()
  const rows = db.prepare(`${MATCH_JOIN_SQL} WHERE m.grp = ? ORDER BY m.match_date ASC`).all(group) as Record<string, unknown>[]
  return rows.map(matchRowToMatch)
}

export function getLatestPrediction(matchId: number): Prediction | null {
  const db = getDb()
  const row = db.prepare(`SELECT * FROM predictions WHERE match_id = ? ORDER BY created_at DESC LIMIT 1`).get(matchId) as Record<string, unknown> | undefined
  return row ? rowToPrediction(row) : null
}

export function getPredictionHistory(matchId: number): Prediction[] {
  const db = getDb()
  const rows = db.prepare(`SELECT * FROM predictions WHERE match_id = ? ORDER BY created_at DESC LIMIT 10`).all(matchId) as Record<string, unknown>[]
  return rows.map(rowToPrediction)
}

export function savePrediction(p: Omit<Prediction, 'id' | 'createdAt'>): Prediction {
  const db = getDb()
  db.prepare(`
    INSERT INTO predictions (
      match_id, home_win_pct, draw_pct, away_win_pct,
      double_chance_1x, double_chance_12, double_chance_x2,
      expected_home_goals, expected_away_goals,
      over15_pct, over25_pct, over35_pct, btts_yes_pct,
      clean_sheet_home_pct, clean_sheet_away_pct,
      expected_corners, over85_corners_pct, over105_corners_pct,
      expected_yellow_cards, over35_yellows_pct, red_card_pct,
      most_likely_score, top_scorers, score_distribution
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    p.matchId, p.homeWinPct, p.drawPct, p.awayWinPct,
    p.doubleChance1X, p.doubleChance12, p.doubleChanceX2,
    p.expectedHomeGoals, p.expectedAwayGoals,
    p.over15Pct, p.over25Pct, p.over35Pct, p.bttsYesPct,
    p.cleanSheetHomePct, p.cleanSheetAwayPct,
    p.expectedCorners, p.over85CornersPct, p.over105CornersPct,
    p.expectedYellowCards, p.over35YellowsPct, p.redCardPct,
    p.mostLikelyScore,
    JSON.stringify(p.topScorers),
    JSON.stringify(p.scoreDistribution),
  )
  return getLatestPrediction(p.matchId)!
}

export function getAllTeams(): Team[] {
  const db = getDb()
  return (db.prepare('SELECT * FROM teams ORDER BY grp, name').all() as Record<string, unknown>[]).map(rowToTeam)
}

export function upsertTeam(t: Team) {
  const db = getDb()
  db.prepare(`
    INSERT INTO teams (id, name, code, flag, grp, elo, avg_goals_for, avg_goals_against, avg_corners, avg_yellow_cards, avg_red_cards)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name=excluded.name, code=excluded.code, flag=excluded.flag, grp=excluded.grp,
      elo=excluded.elo, avg_goals_for=excluded.avg_goals_for, avg_goals_against=excluded.avg_goals_against,
      avg_corners=excluded.avg_corners, avg_yellow_cards=excluded.avg_yellow_cards, avg_red_cards=excluded.avg_red_cards,
      updated_at=datetime('now')
  `).run(t.id, t.name, t.code, t.flag, t.group, t.elo, t.avgGoalsFor, t.avgGoalsAgainst, t.avgCorners, t.avgYellowCards, t.avgRedCards)
}

export function saveMonteCarloOdds(odds: Omit<MonteCarloOdds, 'createdAt'>): void {
  const db = getDb()
  db.prepare(`
    INSERT INTO montecarlo_cache (runs, champion_odds, finalist_odds)
    VALUES (?, ?, ?)
  `).run(odds.runs, JSON.stringify(odds.championOdds), JSON.stringify(odds.finalistOdds))
}

export function getLatestMonteCarloOdds(): MonteCarloOdds | null {
  const db = getDb()
  const row = db.prepare(`SELECT * FROM montecarlo_cache ORDER BY created_at DESC LIMIT 1`).get() as Record<string, unknown> | undefined
  if (!row) return null
  return {
    championOdds: JSON.parse(row.champion_odds as string),
    finalistOdds: JSON.parse(row.finalist_odds as string),
    runs: row.runs as number,
    createdAt: row.created_at as string,
  }
}
