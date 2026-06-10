import type { Match, Prediction, TopScorerPrediction } from '../types'
import {
  buildScoreMatrix,
  outcomeProbs,
  overUnderProb,
  bttsProb,
  mostLikelyScore,
  scoreDistribution,
} from './poisson'

const LEAGUE_AVG_GOALS = 1.35
const HOME_ADVANTAGE = 1.12

function eloExpected(eloA: number, eloB: number): number {
  return 1 / (1 + Math.pow(10, (eloB - eloA) / 400))
}

function lambdaFromElo(team: { elo: number; avgGoalsFor: number; avgGoalsAgainst: number }, opponent: { elo: number; avgGoalsFor: number; avgGoalsAgainst: number }, isHome: boolean): number {
  const attackStrength = team.avgGoalsFor / LEAGUE_AVG_GOALS
  const defenseStrength = opponent.avgGoalsAgainst / LEAGUE_AVG_GOALS
  const eloFactor = 0.5 + eloExpected(team.elo, opponent.elo)
  const homeFactor = isHome ? HOME_ADVANTAGE : 1

  return Math.max(0.1, LEAGUE_AVG_GOALS * attackStrength * defenseStrength * eloFactor * homeFactor)
}

function goalScorerProb(playerGoalRate: number, teamLambda: number): number {
  if (teamLambda <= 0) return 0
  const share = Math.min(playerGoalRate / teamLambda, 0.95)
  return 1 - Math.exp(-share * teamLambda)
}

export function predictMatch(match: Match, players?: Array<{ playerId: number; playerName: string; teamId: number; avgGoalsPerGame: number }>): Omit<Prediction, 'id' | 'createdAt'> {
  const { homeTeam, awayTeam } = match

  const lambdaHome = lambdaFromElo(homeTeam, awayTeam, true)
  const lambdaAway = lambdaFromElo(awayTeam, homeTeam, false)

  const matrix = buildScoreMatrix(lambdaHome, lambdaAway)
  const { home, draw, away } = outcomeProbs(matrix)
  const total = home + draw + away || 1

  const over25 = overUnderProb(matrix, 2.5)
  const over35 = overUnderProb(matrix, 3.5)
  const btts = bttsProb(matrix)
  const { score: likelyScore } = mostLikelyScore(matrix)
  const dist = scoreDistribution(matrix, 10)

  const expectedCorners = homeTeam.avgCorners + awayTeam.avgCorners
  const expectedYellows = homeTeam.avgYellowCards + awayTeam.avgYellowCards

  const topScorers: TopScorerPrediction[] = []
  if (players && players.length > 0) {
    const homePlayers = players.filter(p => p.teamId === homeTeam.id)
    const awayPlayers = players.filter(p => p.teamId === awayTeam.id)

    for (const p of homePlayers.slice(0, 3)) {
      topScorers.push({
        playerId: p.playerId,
        playerName: p.playerName,
        teamId: p.teamId,
        goalProbability: goalScorerProb(p.avgGoalsPerGame, lambdaHome),
        expectedGoals: p.avgGoalsPerGame,
      })
    }
    for (const p of awayPlayers.slice(0, 3)) {
      topScorers.push({
        playerId: p.playerId,
        playerName: p.playerName,
        teamId: p.teamId,
        goalProbability: goalScorerProb(p.avgGoalsPerGame, lambdaAway),
        expectedGoals: p.avgGoalsPerGame,
      })
    }
    topScorers.sort((a, b) => b.goalProbability - a.goalProbability)
  }

  return {
    matchId: match.id,
    homeWinPct: (home / total) * 100,
    drawPct: (draw / total) * 100,
    awayWinPct: (away / total) * 100,
    expectedHomeGoals: lambdaHome,
    expectedAwayGoals: lambdaAway,
    over25Pct: over25 * 100,
    over35Pct: over35 * 100,
    bttsYesPct: btts * 100,
    expectedCorners,
    expectedYellowCards: expectedYellows,
    mostLikelyScore: likelyScore,
    topScorers,
    scoreDistribution: dist,
  }
}
