import { describe, it, expect } from 'vitest'
import { poissonPmf, buildScoreMatrix, outcomeProbs, overUnderProb, bttsProb, mostLikelyScore } from '../poisson'

describe('poissonPmf', () => {
  it('returns 1 for lambda=0, k=0', () => {
    expect(poissonPmf(0, 0)).toBe(1)
  })

  it('returns 0 for lambda=0, k>0', () => {
    expect(poissonPmf(0, 1)).toBe(0)
  })

  it('sums to approximately 1 over a range', () => {
    const lambda = 1.5
    let total = 0
    for (let k = 0; k <= 20; k++) total += poissonPmf(lambda, k)
    expect(total).toBeCloseTo(1, 4)
  })
})

describe('buildScoreMatrix', () => {
  it('produces a matrix that sums to approximately 1', () => {
    const matrix = buildScoreMatrix(1.3, 1.1)
    let total = 0
    for (const row of matrix) for (const p of row) total += p
    expect(total).toBeGreaterThan(0.98)
  })
})

describe('outcomeProbs', () => {
  it('returns probabilities that sum to ~1', () => {
    const matrix = buildScoreMatrix(1.5, 1.2)
    const { home, draw, away } = outcomeProbs(matrix)
    expect(home + draw + away).toBeCloseTo(1, 3)
  })

  it('favors home team when lambda is higher', () => {
    const matrix = buildScoreMatrix(2.0, 0.8)
    const { home, away } = outcomeProbs(matrix)
    expect(home).toBeGreaterThan(away)
  })
})

describe('overUnderProb', () => {
  it('over 0.5 is greater than over 2.5', () => {
    const matrix = buildScoreMatrix(1.3, 1.1)
    const over05 = overUnderProb(matrix, 0.5)
    const over25 = overUnderProb(matrix, 2.5)
    expect(over05).toBeGreaterThan(over25)
  })

  it('returns a value between 0 and 1', () => {
    const matrix = buildScoreMatrix(1.5, 1.5)
    const p = overUnderProb(matrix, 2.5)
    expect(p).toBeGreaterThan(0)
    expect(p).toBeLessThan(1)
  })
})

describe('bttsProb', () => {
  it('is lower when away lambda is very low', () => {
    const matrixHigh = buildScoreMatrix(1.5, 1.5)
    const matrixLow = buildScoreMatrix(1.5, 0.2)
    expect(bttsProb(matrixHigh)).toBeGreaterThan(bttsProb(matrixLow))
  })
})

describe('mostLikelyScore', () => {
  it('returns a valid score string', () => {
    const matrix = buildScoreMatrix(1.3, 1.1)
    const { score } = mostLikelyScore(matrix)
    expect(score).toMatch(/^\d-\d$/)
  })
})
