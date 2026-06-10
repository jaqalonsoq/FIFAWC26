'use server'

import { seedDatabase } from './data/seed'
import { getAllMatches, getMatchById, getLatestPrediction, getPredictionHistory, savePrediction } from './db/queries'
import { predictMatch } from './model/predict'
import type { Match, Prediction } from './types'

function ensureSeeded() {
  seedDatabase()
}

export async function fetchAllMatches(): Promise<Match[]> {
  ensureSeeded()
  const matches = getAllMatches()
  return matches.map(m => ({
    ...m,
    prediction: getLatestPrediction(m.id) ?? undefined,
  }))
}

export async function fetchMatchWithPrediction(id: number): Promise<{ match: Match; prediction: Prediction | null; history: Prediction[] }> {
  ensureSeeded()
  const match = getMatchById(id)
  if (!match) throw new Error(`Partido ${id} no encontrado`)

  let prediction = getLatestPrediction(id)
  if (!prediction) {
    const p = predictMatch(match)
    prediction = savePrediction(p)
  }
  const history = getPredictionHistory(id)

  return { match, prediction, history }
}

export async function recalculateAllPredictions(): Promise<void> {
  ensureSeeded()
  const matches = getAllMatches()
  for (const match of matches) {
    const p = predictMatch(match)
    savePrediction(p)
  }
}
