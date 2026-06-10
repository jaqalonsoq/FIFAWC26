import { fetchMatchWithPrediction } from '@/lib/actions'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ mercado?: string }>
}

export default async function CapturaPage({ params, searchParams }: Props) {
  const { id } = await params
  const { mercado = 'resultado' } = await searchParams
  const { match, prediction: p } = await fetchMatchWithPrediction(Number(id))

  if (!p) return <div style={{ color: 'red' }}>Sin predicción</div>

  const dateObj = new Date(match.date)
  const dateStr = dateObj.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }).toUpperCase()

  return (
    <div style={{
      width: 1080,
      height: 1080,
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      padding: 64,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 4,
        background: 'var(--accent)',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48 }}>
        <div>
          <div className="stat-label" style={{ color: 'var(--accent)', marginBottom: 4 }}>
            FIFA WORLD CUP 2026 &bull; {match.stage.toUpperCase()}
          </div>
          <div className="stat-label">{dateStr} &bull; {match.venue.split(',')[0].toUpperCase()}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="stat-label" style={{ color: 'var(--accent)' }}>PREDICTOR IA</div>
          <div className="stat-label">mundial2026.app</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 56 }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: 96 }}>{match.homeTeam.flag}</div>
          <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.03em', marginTop: 12 }}>{match.homeTeam.code}</div>
          <div className="stat-label" style={{ marginTop: 6, fontSize: 13 }}>{match.homeTeam.name.toUpperCase()}</div>
        </div>

        <div style={{ textAlign: 'center', padding: '0 32px' }}>
          <div style={{ fontSize: 88, fontWeight: 900, color: 'var(--accent)', letterSpacing: '-0.04em', lineHeight: 1 }}>
            {p.mostLikelyScore}
          </div>
          <div className="stat-label" style={{ marginTop: 12, fontSize: 12 }}>RESULTADO MÁS PROBABLE</div>
        </div>

        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: 96 }}>{match.awayTeam.flag}</div>
          <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.03em', marginTop: 12 }}>{match.awayTeam.code}</div>
          <div className="stat-label" style={{ marginTop: 6, fontSize: 13 }}>{match.awayTeam.name.toUpperCase()}</div>
        </div>
      </div>

      {mercado === 'resultado' && (
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', height: 20, gap: 3, marginBottom: 24 }}>
            <div style={{ flex: p.homeWinPct, background: 'var(--accent)', borderRadius: 2 }} />
            <div style={{ flex: p.drawPct, background: 'var(--text-muted)', borderRadius: 2 }} />
            <div style={{ flex: p.awayWinPct, background: 'var(--warn)', borderRadius: 2 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <StatCard label={`GANA ${match.homeTeam.code}`} value={`${p.homeWinPct.toFixed(0)}%`} color="var(--accent)" />
            <StatCard label="EMPATE" value={`${p.drawPct.toFixed(0)}%`} color="var(--text-muted)" />
            <StatCard label={`GANA ${match.awayTeam.code}`} value={`${p.awayWinPct.toFixed(0)}%`} color="var(--warn)" />
          </div>
        </div>
      )}

      {mercado === 'goles' && (
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, alignContent: 'start' }}>
          <StatCard label={`xG ${match.homeTeam.code}`} value={p.expectedHomeGoals.toFixed(2)} color="var(--accent)" large />
          <StatCard label={`xG ${match.awayTeam.code}`} value={p.expectedAwayGoals.toFixed(2)} color="var(--accent)" large />
          <StatCard label="MÁS DE 2.5 GOLES" value={`${p.over25Pct.toFixed(0)}%`} color="var(--text-primary)" />
          <StatCard label="AMBOS ANOTAN" value={`${p.bttsYesPct.toFixed(0)}%`} color="var(--text-primary)" />
        </div>
      )}

      {mercado === 'marcadores' && (
        <div style={{ flex: 1 }}>
          <div className="stat-label" style={{ marginBottom: 16 }}>TOP MARCADORES PROBABLES</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {p.scoreDistribution.slice(0, 6).map(d => (
              <div key={d.score} style={{
                padding: '20px 16px',
                border: d.score === p.mostLikelyScore ? '2px solid var(--accent)' : '1px solid var(--border)',
                background: d.score === p.mostLikelyScore ? 'var(--accent-dim)' : 'var(--surface)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 40, fontWeight: 900, color: d.score === p.mostLikelyScore ? 'var(--accent)' : 'var(--text-primary)' }}>{d.score}</div>
                <div className="stat-label" style={{ marginTop: 8, fontSize: 16 }}>{(d.probability * 100).toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{
        position: 'absolute', bottom: 32, left: 64, right: 64,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 16, borderTop: '1px solid var(--border)',
      }}>
        <div className="stat-label" style={{ fontSize: 10 }}>
          MODELO POISSON + ELO &bull; SOLO ENTRETENIMIENTO
        </div>
        <div className="stat-label" style={{ color: 'var(--accent)', fontSize: 10 }}>
          @predictor_mundial2026
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color, large }: { label: string; value: string; color: string; large?: boolean }) {
  return (
    <div style={{ padding: '20px 24px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
      <div className="stat-label" style={{ marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: large ? 52 : 40, fontWeight: 900, color, letterSpacing: '-0.02em', lineHeight: 1 }}>
        {value}
      </div>
    </div>
  )
}
