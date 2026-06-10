import { getDb } from './schema'
import type { Match, Prediction, Team } from '../types'

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
    expectedHomeGoals: row.expected_home_goals as number,
    expectedAwayGoals: row.expected_away_goals as number,
    over25Pct: row.over25_pct as number,
    over35Pct: row.over35_pct as number,
    bttsYesPct: row.btts_yes_pct as number,
    expectedCorners: row.expected_corners as number,
    expectedYellowCards: row.expected_yellow_cards as number,
    mostLikelyScore: row.most_likely_score as string,
    topScorers: JSON.parse(row.top_scorers as string),
    scoreDistribution: JSON.parse(row.score_distribution as string),
  }
}

export function getAllMatches(): Match[] {
  const db = getDb()
  const rows = db.prepare(`
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
    ORDER BY m.match_date ASC
  `).all() as Record<string, unknown>[]

  return rows.map(r => ({
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
  }))
}

export function getMatchById(id: number): Match | null {
  const db = getDb()
  const r = db.prepare(`
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
    WHERE m.id = ?
  `).get(id) as Record<string, unknown> | undefined

  if (!r) return null

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

export function getLatestPrediction(matchId: number): Prediction | null {
  const db = getDb()
  const row = db.prepare(`
    SELECT * FROM predictions WHERE match_id = ? ORDER BY created_at DESC LIMIT 1
  `).get(matchId) as Record<string, unknown> | undefined
  return row ? rowToPrediction(row) : null
}

export function getPredictionHistory(matchId: number): Prediction[] {
  const db = getDb()
  const rows = db.prepare(`
    SELECT * FROM predictions WHERE match_id = ? ORDER BY created_at DESC LIMIT 10
  `).all(matchId) as Record<string, unknown>[]
  return rows.map(rowToPrediction)
}

export function savePrediction(p: Omit<Prediction, 'id' | 'createdAt'>): Prediction {
  const db = getDb()
  const result = db.prepare(`
    INSERT INTO predictions (
      match_id, home_win_pct, draw_pct, away_win_pct,
      expected_home_goals, expected_away_goals,
      over25_pct, over35_pct, btts_yes_pct,
      expected_corners, expected_yellow_cards,
      most_likely_score, top_scorers, score_distribution
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    p.matchId, p.homeWinPct, p.drawPct, p.awayWinPct,
    p.expectedHomeGoals, p.expectedAwayGoals,
    p.over25Pct, p.over35Pct, p.bttsYesPct,
    p.expectedCorners, p.expectedYellowCards,
    p.mostLikelyScore,
    JSON.stringify(p.topScorers),
    JSON.stringify(p.scoreDistribution)
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
