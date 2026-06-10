export interface Team {
  id: number
  name: string
  code: string
  flag: string
  group: string
  elo: number
  avgGoalsFor: number
  avgGoalsAgainst: number
  avgCorners: number
  avgYellowCards: number
  avgRedCards: number
}

export interface Match {
  id: number
  homeTeamId: number
  awayTeamId: number
  homeTeam: Team
  awayTeam: Team
  date: string
  stage: string
  group: string | null
  venue: string
  prediction?: Prediction
}

export interface Prediction {
  id: number
  matchId: number
  createdAt: string
  homeWinPct: number
  drawPct: number
  awayWinPct: number
  doubleChance1X: number
  doubleChance12: number
  doubleChanceX2: number
  expectedHomeGoals: number
  expectedAwayGoals: number
  over15Pct: number
  over25Pct: number
  over35Pct: number
  bttsYesPct: number
  cleanSheetHomePct: number
  cleanSheetAwayPct: number
  expectedCorners: number
  over85CornersPct: number
  over105CornersPct: number
  expectedYellowCards: number
  over35YellowsPct: number
  redCardPct: number
  mostLikelyScore: string
  topScorers: TopScorerPrediction[]
  scoreDistribution: ScoreDistributionEntry[]
}

export interface TopScorerPrediction {
  playerId: number
  playerName: string
  teamId: number
  goalProbability: number
  expectedGoals: number
}

export interface ScoreDistributionEntry {
  score: string
  probability: number
}

export interface Player {
  id: number
  name: string
  teamId: number
  position: string
  avgGoalsPerGame: number
  gamesPlayed: number
}

export interface MonteCarloOdds {
  championOdds: Record<string, number>
  finalistOdds: Record<string, number>
  runs: number
  createdAt: string
}
