import { recalculateAllPredictions } from '../src/lib/actions'

async function main() {
  console.log('[cron] Recalculando predicciones...')
  await recalculateAllPredictions()
  console.log('[cron] Listo.')
  process.exit(0)
}

main().catch(err => {
  console.error('[cron] Error:', err)
  process.exit(1)
})
