import { describe, it, expect } from 'vitest'
import { predictMatch } from '../predict'
import type { Match } from '../../types'

const mockTeam = (id: number, elo: number, gf = 1.5, ga = 1.1) => ({
  id,
  name: `Team ${id}`,
  code: `T${id}`,
  flag: '',
  group: 'A',
  elo,
  avgGoalsFor: gf,
  avgGoalsAgainst: ga,
  avgCorners: 5.0,
  avgYellowCards: 1.8,
  avgRedCards: 0.1,
})

const mockMatch = (home: ReturnType<typeof mockTeam>, away: ReturnType<typeof mockTeam>): Match => ({
  id: 1,
  homeTeamId: home.id,
  awayTeamId: away.id,
  homeTeam: home,
  awayTeam: away,
  date: '2026-06-12',
  stage: 'Grupo A',
  group: 'A',
  venue: 'Test Stadium',
})

describe('predictMatch', () => {
  it('probabilities 1X2 sum to 100', () => {
    const m = mockMatch(mockTeam(1, 1900), mockTeam(2, 1700))
    const p = predictMatch(m)
    const sum = p.homeWinPct + p.drawPct + p.awayWinPct
    expect(sum).toBeCloseTo(100, 1)
  })

  it('double chance 1X = home + draw', () => {
    const m = mockMatch(mockTeam(1, 1800), mockTeam(2, 1700))
    const p = predictMatch(m)
    expect(p.doubleChance1X).toBeCloseTo(p.homeWinPct + p.drawPct, 2)
  })

  it('over 1.5 > over 2.5 > over 3.5', () => {
    const m = mockMatch(mockTeam(1, 1800), mockTeam(2, 1700))
    const p = predictMatch(m)
    expect(p.over15Pct).toBeGreaterThan(p.over25Pct)
    expect(p.over25Pct).toBeGreaterThan(p.over35Pct)
  })

  it('higher ELO team wins more often', () => {
    const strong = mockTeam(1, 1950, 2.0, 0.8)
    const weak = mockTeam(2, 1500, 1.0, 1.8)
    const m = mockMatch(strong, weak)
    const p = predictMatch(m)
    expect(p.homeWinPct).toBeGreaterThan(p.awayWinPct)
  })

  it('returns a valid most likely score', () => {
    const m = mockMatch(mockTeam(1, 1800), mockTeam(2, 1700))
    const p = predictMatch(m)
    expect(p.mostLikelyScore).toMatch(/^\d-\d$/)
  })

  it('all percentage fields are between 0 and 100', () => {
    const m = mockMatch(mockTeam(1, 1800), mockTeam(2, 1700))
    const p = predictMatch(m)
    const pcts = [
      p.homeWinPct, p.drawPct, p.awayWinPct,
      p.over15Pct, p.over25Pct, p.over35Pct,
      p.bttsYesPct, p.cleanSheetHomePct, p.cleanSheetAwayPct,
      p.over85CornersPct, p.over105CornersPct,
      p.over35YellowsPct, p.redCardPct,
    ]
    for (const v of pcts) {
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThanOrEqual(100)
    }
  })
})
