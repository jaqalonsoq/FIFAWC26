'use server'

import { seedDatabase } from './data/seed'
import { getAllMatches, getMatchById, getMatchesByGroup, getLatestPrediction, getPredictionHistory, savePrediction, getAllTeams, saveMonteCarloOdds, getLatestMonteCarloOdds } from './db/queries'
import { predictMatch } from './model/predict'
import { runMonteCarlo } from './model/montecarlo'
import { WC2026_TEAMS, GROUPS } from './data/wc2026-teams'
import type { Match, Prediction, MonteCarloOdds } from './types'

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

export async function fetchGroupData(group: string): Promise<{ matches: Match[] }> {
  ensureSeeded()
  const matches = getMatchesByGroup(group)
  const matchesWithPreds = matches.map(m => ({
    ...m,
    prediction: getLatestPrediction(m.id) ?? undefined,
  }))
  return { matches: matchesWithPreds }
}

export async function fetchChampionOdds(): Promise<MonteCarloOdds> {
  ensureSeeded()

  const cached = getLatestMonteCarloOdds()
  if (cached) {
    const ageMs = Date.now() - new Date(cached.createdAt).getTime()
    if (ageMs < 1000 * 60 * 60 * 6) return cached
  }

  const groups: Record<string, typeof WC2026_TEAMS> = {}
  for (const g of GROUPS) {
    groups[g] = WC2026_TEAMS.filter(t => t.group === g)
  }

  const result = runMonteCarlo(groups, 10000)
  saveMonteCarloOdds(result)
  return { ...result, createdAt: new Date().toISOString() }
}

export async function recalculateAllPredictions(): Promise<void> {
  ensureSeeded()
  const matches = getAllMatches()
  for (const match of matches) {
    const p = predictMatch(match)
    savePrediction(p)
  }

  const groups: Record<string, typeof WC2026_TEAMS> = {}
  for (const g of GROUPS) {
    groups[g] = WC2026_TEAMS.filter(t => t.group === g)
  }
  const mc = runMonteCarlo(groups, 10000)
  saveMonteCarloOdds(mc)
}
