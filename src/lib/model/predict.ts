import type { Match, Prediction } from '../types'
import {
  buildScoreMatrix,
  outcomeProbs,
  overUnderProb,
  bttsProb,
  mostLikelyScore,
  scoreDistribution,
  poissonPmf,
} from './poisson'
import { predictCards } from './cards'
import { predictCorners } from './corners'
import { predictScorers, type ScorerInput } from './scorers'

const LEAGUE_AVG_GOALS = 1.35
const HOME_ADVANTAGE = 1.12

function eloExpected(eloA: number, eloB: number): number {
  return 1 / (1 + Math.pow(10, (eloB - eloA) / 400))
}

function lambdaFromTeams(attacker: { elo: number; avgGoalsFor: number; avgGoalsAgainst: number }, defender: { elo: number; avgGoalsFor: number; avgGoalsAgainst: number }, isHome: boolean): number {
  const attackStrength = attacker.avgGoalsFor / LEAGUE_AVG_GOALS
  const defenseStrength = defender.avgGoalsAgainst / LEAGUE_AVG_GOALS
  const eloFactor = 0.5 + eloExpected(attacker.elo, defender.elo)
  const homeFactor = isHome ? HOME_ADVANTAGE : 1
  return Math.max(0.1, LEAGUE_AVG_GOALS * attackStrength * defenseStrength * eloFactor * homeFactor)
}

function cleanSheetProb(lambdaAgainst: number): number {
  return poissonPmf(lambdaAgainst, 0)
}

export function predictMatch(
  match: Match,
  players?: ScorerInput[],
): Omit<Prediction, 'id' | 'createdAt'> {
  const { homeTeam, awayTeam } = match

  const lambdaHome = lambdaFromTeams(homeTeam, awayTeam, true)
  const lambdaAway = lambdaFromTeams(awayTeam, homeTeam, false)

  const matrix = buildScoreMatrix(lambdaHome, lambdaAway)
  const { home, draw, away } = outcomeProbs(matrix)
  const total = home + draw + away || 1

  const homeWin = (home / total) * 100
  const drawPct = (draw / total) * 100
  const awayWin = (away / total) * 100

  const over15 = overUnderProb(matrix, 1.5) * 100
  const over25 = overUnderProb(matrix, 2.5) * 100
  const over35 = overUnderProb(matrix, 3.5) * 100
  const btts = bttsProb(matrix) * 100

  const { score: likelyScore } = mostLikelyScore(matrix)
  const dist = scoreDistribution(matrix, 12)

  const cards = predictCards(homeTeam, awayTeam)
  const corners = predictCorners(homeTeam, awayTeam)

  const homePlayers = players?.filter(p => p.teamId === homeTeam.id) ?? []
  const awayPlayers = players?.filter(p => p.teamId === awayTeam.id) ?? []
  const topScorers = predictScorers(homePlayers.slice(0, 4), awayPlayers.slice(0, 4), lambdaHome, lambdaAway)

  return {
    matchId: match.id,
    homeWinPct: homeWin,
    drawPct,
    awayWinPct: awayWin,
    doubleChance1X: homeWin + drawPct,
    doubleChance12: homeWin + awayWin,
    doubleChanceX2: drawPct + awayWin,
    expectedHomeGoals: lambdaHome,
    expectedAwayGoals: lambdaAway,
    over15Pct: over15,
    over25Pct: over25,
    over35Pct: over35,
    bttsYesPct: btts,
    cleanSheetHomePct: cleanSheetProb(lambdaAway) * 100,
    cleanSheetAwayPct: cleanSheetProb(lambdaHome) * 100,
    expectedCorners: corners.expectedCorners,
    over85CornersPct: corners.over85Pct,
    over105CornersPct: corners.over105Pct,
    expectedYellowCards: cards.expectedYellows,
    over35YellowsPct: cards.over35YellowsPct,
    redCardPct: cards.redCardPct,
    mostLikelyScore: likelyScore,
    topScorers,
    scoreDistribution: dist,
  }
}
