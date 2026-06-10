import type { Team } from '../types'

const WORLD_AVG_YELLOWS = 3.6
const WORLD_AVG_REDS = 0.2

export interface CardsPrediction {
  expectedYellows: number
  expectedReds: number
  over35YellowsPct: number
  over45YellowsPct: number
  redCardPct: number
}

export function predictCards(home: Team, away: Team): CardsPrediction {
  const expectedYellows = home.avgYellowCards + away.avgYellowCards
  const expectedReds = home.avgRedCards + away.avgRedCards

  const eloGap = Math.abs(home.elo - away.elo)
  const intensityFactor = 1 + (eloGap > 200 ? 0.05 : 0)

  const adjustedYellows = expectedYellows * intensityFactor
  const adjustedReds = expectedReds * intensityFactor

  const yellowRatio = adjustedYellows / WORLD_AVG_YELLOWS
  const over35YellowsPct = Math.min(95, Math.max(5, 50 + (yellowRatio - 1) * 35))
  const over45YellowsPct = Math.min(90, Math.max(5, over35YellowsPct * 0.55))

  const redCardPct = Math.min(40, adjustedReds * WORLD_AVG_REDS * 100 * 2.5)

  return {
    expectedYellows: adjustedYellows,
    expectedReds: adjustedReds,
    over35YellowsPct,
    over45YellowsPct,
    redCardPct,
  }
}
