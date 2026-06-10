import type { Team } from '../types'

export interface CornersPrediction {
  expectedCorners: number
  over85Pct: number
  over105Pct: number
  homeCorners: number
  awayCorners: number
}

export function predictCorners(home: Team, away: Team): CornersPrediction {
  const homeCorners = home.avgCorners * 1.05
  const awayCorners = away.avgCorners * 0.95
  const expectedCorners = homeCorners + awayCorners

  const ratio = expectedCorners / 10.5
  const over85Pct = Math.min(92, Math.max(8, 50 + (ratio - 1) * 50))
  const over105Pct = Math.min(85, Math.max(8, over85Pct * 0.55))

  return {
    expectedCorners,
    over85Pct,
    over105Pct,
    homeCorners,
    awayCorners,
  }
}
