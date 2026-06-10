import type { TopScorerPrediction } from '../types'

export interface ScorerInput {
  playerId: number
  playerName: string
  teamId: number
  avgGoalsPerGame: number
}

export function predictScorers(
  homePlayers: ScorerInput[],
  awayPlayers: ScorerInput[],
  lambdaHome: number,
  lambdaAway: number,
): TopScorerPrediction[] {
  function scorerProb(avgGoals: number, teamLambda: number): number {
    if (teamLambda <= 0 || avgGoals <= 0) return 0
    const share = Math.min(avgGoals / teamLambda, 0.95)
    return 1 - Math.exp(-share * teamLambda)
  }

  const result: TopScorerPrediction[] = []

  for (const p of homePlayers) {
    result.push({
      playerId: p.playerId,
      playerName: p.playerName,
      teamId: p.teamId,
      goalProbability: scorerProb(p.avgGoalsPerGame, lambdaHome),
      expectedGoals: p.avgGoalsPerGame,
    })
  }

  for (const p of awayPlayers) {
    result.push({
      playerId: p.playerId,
      playerName: p.playerName,
      teamId: p.teamId,
      goalProbability: scorerProb(p.avgGoalsPerGame, lambdaAway),
      expectedGoals: p.avgGoalsPerGame,
    })
  }

  return result.sort((a, b) => b.goalProbability - a.goalProbability)
}
