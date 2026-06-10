import { NextRequest, NextResponse } from 'next/server'
import { recalculateAllPredictions } from '@/lib/actions'

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret') ?? req.nextUrl.searchParams.get('secret')

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await recalculateAllPredictions()
    return NextResponse.json({ ok: true, recalculated: true, ts: new Date().toISOString() })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
