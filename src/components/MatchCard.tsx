import Link from 'next/link'
import type { Match } from '@/lib/types'

function fmt(p: number) {
  return p.toFixed(1) + '%'
}

interface Props {
  match: Match
}

export default function MatchCard({ match }: Props) {
  const p = match.prediction
  const dateObj = new Date(match.date)
  const day = dateObj.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }).toUpperCase()
  const hour = dateObj.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Bogota' })

  return (
    <Link href={`/partido/${match.id}`} className="block">
      <div
        className="border border-[var(--border)] hover:border-[var(--accent)] bg-[var(--surface)] transition-colors duration-150 cursor-pointer"
        style={{ padding: '16px 20px' }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="stat-label">{match.stage} &bull; {day} {hour}</span>
          <span className="stat-label" style={{ color: 'var(--accent)' }}>{match.homeTeam.group ? `GRUPO ${match.homeTeam.group}` : match.stage.toUpperCase()}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 text-right">
            <div className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {match.homeTeam.flag} {match.homeTeam.code}
            </div>
            <div className="stat-label mt-1">{match.homeTeam.name}</div>
          </div>

          <div className="flex flex-col items-center px-4">
            {p ? (
              <>
                <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                  {match.prediction?.mostLikelyScore}
                </div>
                <div className="stat-label mt-1">más probable</div>
              </>
            ) : (
              <div className="stat-label">VS</div>
            )}
          </div>

          <div className="flex-1 text-left">
            <div className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {match.awayTeam.flag} {match.awayTeam.code}
            </div>
            <div className="stat-label mt-1">{match.awayTeam.name}</div>
          </div>
        </div>

        {p && (
          <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex gap-1 h-1 rounded-none overflow-hidden">
              <div style={{ width: `${p.homeWinPct}%`, background: 'var(--accent)' }} />
              <div style={{ width: `${p.drawPct}%`, background: 'var(--text-muted)' }} />
              <div style={{ width: `${p.awayWinPct}%`, background: 'var(--warn)' }} />
            </div>
            <div className="flex justify-between mt-2">
              <span className="stat-label" style={{ color: 'var(--accent)' }}>{fmt(p.homeWinPct)} {match.homeTeam.code}</span>
              <span className="stat-label">X {fmt(p.drawPct)}</span>
              <span className="stat-label" style={{ color: 'var(--warn)' }}>{match.awayTeam.code} {fmt(p.awayWinPct)}</span>
            </div>
          </div>
        )}

        <div className="mt-2 text-right">
          <span className="stat-label" style={{ color: 'var(--accent)', fontSize: '9px' }}>VER ANÁLISIS &rarr;</span>
        </div>
      </div>
    </Link>
  )
}
