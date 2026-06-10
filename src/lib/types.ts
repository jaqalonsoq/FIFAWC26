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
  expectedHomeGoals: number
  expectedAwayGoals: number
  over25Pct: number
  over35Pct: number
  bttsYesPct: number
  expectedCorners: number
  expectedYellowCards: number
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
