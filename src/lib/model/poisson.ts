export function poissonPmf(lambda: number, k: number): number {
  if (lambda <= 0) return k === 0 ? 1 : 0
  let logP = -lambda + k * Math.log(lambda)
  for (let i = 1; i <= k; i++) logP -= Math.log(i)
  return Math.exp(logP)
}

export function buildScoreMatrix(lambdaHome: number, lambdaAway: number, maxGoals = 7) {
  const matrix: number[][] = []
  for (let h = 0; h <= maxGoals; h++) {
    matrix[h] = []
    for (let a = 0; a <= maxGoals; a++) {
      matrix[h][a] = poissonPmf(lambdaHome, h) * poissonPmf(lambdaAway, a)
    }
  }
  return matrix
}

export function outcomeProbs(matrix: number[][]): { home: number; draw: number; away: number } {
  let home = 0, draw = 0, away = 0
  for (let h = 0; h < matrix.length; h++) {
    for (let a = 0; a < matrix[h].length; a++) {
      const p = matrix[h][a]
      if (h > a) home += p
      else if (h === a) draw += p
      else away += p
    }
  }
  return { home, draw, away }
}

export function overUnderProb(matrix: number[][], threshold: number): number {
  let over = 0
  for (let h = 0; h < matrix.length; h++) {
    for (let a = 0; a < matrix[h].length; a++) {
      if (h + a > threshold) over += matrix[h][a]
    }
  }
  return over
}

export function bttsProb(matrix: number[][]): number {
  let btts = 0
  for (let h = 1; h < matrix.length; h++) {
    for (let a = 1; a < matrix[h].length; a++) {
      btts += matrix[h][a]
    }
  }
  return btts
}

export function mostLikelyScore(matrix: number[][]): { score: string; prob: number } {
  let best = { score: '1-0', prob: 0 }
  for (let h = 0; h < matrix.length; h++) {
    for (let a = 0; a < matrix[h].length; a++) {
      if (matrix[h][a] > best.prob) {
        best = { score: `${h}-${a}`, prob: matrix[h][a] }
      }
    }
  }
  return best
}

export function scoreDistribution(matrix: number[][], topN = 10): Array<{ score: string; probability: number }> {
  const entries: Array<{ score: string; probability: number }> = []
  for (let h = 0; h < matrix.length; h++) {
    for (let a = 0; a < matrix[h].length; a++) {
      entries.push({ score: `${h}-${a}`, probability: matrix[h][a] })
    }
  }
  return entries.sort((x, y) => y.probability - x.probability).slice(0, topN)
}
