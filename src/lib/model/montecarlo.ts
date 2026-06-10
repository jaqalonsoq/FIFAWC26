import type { Team } from '../types'
import { buildScoreMatrix, outcomeProbs } from './poisson'

const LEAGUE_AVG_GOALS = 1.35
const HOME_ADVANTAGE = 1.08

interface MatchResult {
  homeGoals: number
  awayGoals: number
}

function samplePoisson(lambda: number): number {
  let L = Math.exp(-lambda)
  let k = 0
  let p = 1
  do {
    k++
    p *= Math.random()
  } while (p > L)
  return k - 1
}

function lambda(attacker: Team, defender: Team, isHome: boolean): number {
  const attack = attacker.avgGoalsFor / LEAGUE_AVG_GOALS
  const defense = defender.avgGoalsAgainst / LEAGUE_AVG_GOALS
  const eloExp = 1 / (1 + Math.pow(10, (defender.elo - attacker.elo) / 400))
  const eloFactor = 0.5 + eloExp
  const homeFactor = isHome ? HOME_ADVANTAGE : 1
  return Math.max(0.1, LEAGUE_AVG_GOALS * attack * defense * eloFactor * homeFactor)
}

function simulateMatch(home: Team, away: Team): MatchResult {
  const lh = lambda(home, away, true)
  const la = lambda(away, home, false)
  return { homeGoals: samplePoisson(lh), awayGoals: samplePoisson(la) }
}

function winProbability(home: Team, away: Team): { home: number; draw: number; away: number } {
  const lh = lambda(home, away, true)
  const la = lambda(away, home, false)
  const matrix = buildScoreMatrix(lh, la)
  return outcomeProbs(matrix)
}

export interface GroupStanding {
  team: Team
  played: number
  won: number
  drawn: number
  lost: number
  gf: number
  ga: number
  pts: number
}

function simulateGroup(teams: Team[]): GroupStanding[] {
  const standings: Map<number, GroupStanding> = new Map(
    teams.map(t => [t.id, { team: t, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 }])
  )

  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const home = teams[i]
      const away = teams[j]
      const { homeGoals, awayGoals } = simulateMatch(home, away)

      const hs = standings.get(home.id)!
      const as_ = standings.get(away.id)!

      hs.played++; as_.played++
      hs.gf += homeGoals; hs.ga += awayGoals
      as_.gf += awayGoals; as_.ga += homeGoals

      if (homeGoals > awayGoals) {
        hs.won++; hs.pts += 3; as_.lost++
      } else if (homeGoals === awayGoals) {
        hs.drawn++; hs.pts += 1; as_.drawn++; as_.pts += 1
      } else {
        as_.won++; as_.pts += 3; hs.lost++
      }
    }
  }

  return Array.from(standings.values()).sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts
    const gdA = a.gf - a.ga, gdB = b.gf - b.ga
    if (gdB !== gdA) return gdB - gdA
    return b.gf - a.gf
  })
}

function winKnockout(a: Team, b: Team): Team {
  const lh = lambda(a, b, false)
  const la = lambda(b, a, false)
  const gh = samplePoisson(lh)
  const ga = samplePoisson(la)
  if (gh !== ga) return gh > ga ? a : b
  return Math.random() < 0.5 ? a : b
}

export interface TournamentResult {
  champion: Team
  finalist: Team
  topScorer?: Team
}

function simulateTournament(groups: Record<string, Team[]>): TournamentResult {
  const groupWinners: Team[] = []
  const runnersUp: Team[] = []

  for (const teams of Object.values(groups)) {
    const standing = simulateGroup(teams)
    groupWinners.push(standing[0].team)
    runnersUp.push(standing[1].team)
  }

  const bracket = [
    ...groupWinners.slice(0, 6),
    ...runnersUp.slice(0, 6),
    groupWinners[6] ?? groupWinners[0],
    groupWinners[7] ?? groupWinners[1],
  ]

  let teams = [...bracket]
  while (teams.length > 2) {
    const next: Team[] = []
    for (let i = 0; i < teams.length; i += 2) {
      next.push(winKnockout(teams[i], teams[i + 1] ?? teams[i]))
    }
    teams = next
  }

  return {
    champion: teams[0],
    finalist: teams[1] ?? teams[0],
  }
}

export interface MonteCarloResult {
  championOdds: Record<string, number>
  finalistOdds: Record<string, number>
  runs: number
}

export function runMonteCarlo(
  groups: Record<string, Team[]>,
  iterations = 10000,
): MonteCarloResult {
  const championCount: Record<string, number> = {}
  const finalistCount: Record<string, number> = {}

  for (let i = 0; i < iterations; i++) {
    const result = simulateTournament(groups)
    const cKey = result.champion.code
    const fKey = result.finalist.code
    championCount[cKey] = (championCount[cKey] ?? 0) + 1
    finalistCount[fKey] = (finalistCount[fKey] ?? 0) + 1
    finalistCount[cKey] = (finalistCount[cKey] ?? 0) + 1
  }

  const championOdds: Record<string, number> = {}
  const finalistOdds: Record<string, number> = {}
  for (const [k, v] of Object.entries(championCount)) {
    championOdds[k] = (v / iterations) * 100
  }
  for (const [k, v] of Object.entries(finalistCount)) {
    finalistOdds[k] = (v / iterations) * 100
  }

  return { championOdds, finalistOdds, runs: iterations }
}

export function getProjectedGroupStandings(teams: Team[]): GroupStanding[] {
  const SIMS = 5000
  const totals: Map<number, GroupStanding> = new Map(
    teams.map(t => [t.id, { team: t, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 }])
  )

  for (let s = 0; s < SIMS; s++) {
    const sim = simulateGroup(teams)
    for (const row of sim) {
      const t = totals.get(row.team.id)!
      t.pts += row.pts
      t.gf += row.gf
      t.ga += row.ga
      t.won += row.won
      t.drawn += row.drawn
      t.lost += row.lost
      t.played += row.played
    }
  }

  return Array.from(totals.values())
    .map(t => ({
      ...t,
      played: Math.round(t.played / SIMS),
      won: Math.round(t.won / SIMS * 10) / 10,
      drawn: Math.round(t.drawn / SIMS * 10) / 10,
      lost: Math.round(t.lost / SIMS * 10) / 10,
      gf: Math.round(t.gf / SIMS * 10) / 10,
      ga: Math.round(t.ga / SIMS * 10) / 10,
      pts: Math.round(t.pts / SIMS * 10) / 10,
    }))
    .sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga))
}

export { winProbability }
