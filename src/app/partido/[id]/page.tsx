import Link from 'next/link'
import { fetchMatchWithPrediction } from '@/lib/actions'
import StatBlock from '@/components/StatBlock'
import ProbBar from '@/components/ProbBar'
import ScoreHeatmap from '@/components/ScoreHeatmap'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PartidoPage({ params }: Props) {
  const { id } = await params
  const { match, prediction: p } = await fetchMatchWithPrediction(Number(id))

  if (!p) {
    return (
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px' }}>
        <p className="stat-label">Sin predicción disponible</p>
      </main>
    )
  }

  const dateObj = new Date(match.date)
  const dateStr = dateObj.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()
  const hourStr = dateObj.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Bogota' })

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px' }}>
      <Link href="/" style={{ display: 'inline-block', marginBottom: 24, color: 'var(--text-muted)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
        &larr; Todos los partidos
      </Link>

      <div style={{ marginBottom: 32 }}>
        <span className="stat-label" style={{ color: 'var(--accent)' }}>{match.stage} &bull; {dateStr} &bull; {hourStr} COL</span>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{match.venue}</div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        gap: 24,
        marginBottom: 48,
        padding: '32px 24px',
        border: '1px solid var(--border)',
        background: 'var(--surface)',
      }}>
        <div>
          <div style={{ fontSize: 56, textAlign: 'center' }}>{match.homeTeam.flag}</div>
          <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', textAlign: 'center', marginTop: 8 }}>{match.homeTeam.code}</div>
          <div className="stat-label" style={{ textAlign: 'center', marginTop: 4 }}>{match.homeTeam.name}</div>
          <div className="stat-label" style={{ textAlign: 'center', color: 'var(--accent)', marginTop: 8 }}>ELO {match.homeTeam.elo}</div>
        </div>

        <div style={{ textAlign: 'center', padding: '0 16px' }}>
          <div style={{ fontSize: 48, fontWeight: 900, color: 'var(--accent)', letterSpacing: '-0.04em', lineHeight: 1 }}>
            {p.mostLikelyScore}
          </div>
          <div className="stat-label" style={{ marginTop: 8 }}>RESULTADO MÁS PROBABLE</div>
          <div className="stat-label" style={{ marginTop: 4, color: 'var(--accent)' }}>
            {(p.scoreDistribution.find(d => d.score === p.mostLikelyScore)?.probability ?? 0 * 100).toFixed(1)}%
          </div>
        </div>

        <div>
          <div style={{ fontSize: 56, textAlign: 'center' }}>{match.awayTeam.flag}</div>
          <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', textAlign: 'center', marginTop: 8 }}>{match.awayTeam.code}</div>
          <div className="stat-label" style={{ textAlign: 'center', marginTop: 4 }}>{match.awayTeam.name}</div>
          <div className="stat-label" style={{ textAlign: 'center', color: 'var(--warn)', marginTop: 8 }}>ELO {match.awayTeam.elo}</div>
        </div>
      </div>

      <section style={{ marginBottom: 40 }}>
        <SectionTitle>RESULTADO</SectionTitle>
        <ProbBar
          segments={[
            { label: match.homeTeam.code, value: p.homeWinPct, color: 'var(--accent)' },
            { label: 'EMPATE', value: p.drawPct, color: 'var(--text-muted)' },
            { label: match.awayTeam.code, value: p.awayWinPct, color: 'var(--warn)' },
          ]}
          height={12}
        />
      </section>

      <section style={{ marginBottom: 40 }}>
        <SectionTitle>GOLES ESPERADOS</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          <StatBlock label={`xG ${match.homeTeam.code}`} value={p.expectedHomeGoals.toFixed(2)} accent />
          <StatBlock label={`xG ${match.awayTeam.code}`} value={p.expectedAwayGoals.toFixed(2)} />
          <StatBlock label="MÁS DE 2.5" value={p.over25Pct.toFixed(0)} unit="%" />
          <StatBlock label="MÁS DE 3.5" value={p.over35Pct.toFixed(0)} unit="%" />
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <SectionTitle>OTROS MERCADOS</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          <StatBlock label="AMBOS ANOTAN" value={p.bttsYesPct.toFixed(0)} unit="%" />
          <StatBlock label="CÓRNERS ESPERADOS" value={p.expectedCorners.toFixed(1)} />
          <StatBlock label="AMARILLAS ESPERADAS" value={p.expectedYellowCards.toFixed(1)} />
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <SectionTitle>DISTRIBUCIÓN DE MARCADORES</SectionTitle>
        <div style={{
          padding: 24,
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          overflowX: 'auto',
        }}>
          <ScoreHeatmap
            data={p.scoreDistribution}
            homeCode={match.homeTeam.code}
            awayCode={match.awayTeam.code}
          />
        </div>
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
          {p.scoreDistribution.slice(0, 5).map(d => (
            <div
              key={d.score}
              style={{
                padding: '12px 8px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>{d.score}</div>
              <div className="stat-label">{(d.probability * 100).toFixed(1)}%</div>
            </div>
          ))}
        </div>
      </section>

      {p.topScorers.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <SectionTitle>PROBABILIDAD GOLEADOR</SectionTitle>
          <div style={{ display: 'grid', gap: 4 }}>
            {p.topScorers.map(scorer => (
              <div
                key={scorer.playerId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '12px 16px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{scorer.playerName}</div>
                  <div className="stat-label">xG/partido: {scorer.expectedGoals.toFixed(2)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent)' }}>
                    {(scorer.goalProbability * 100).toFixed(0)}<span style={{ fontSize: 12 }}>%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
        <p className="stat-label">
          CALCULADO CON POISSON + ELO &bull; {new Date(p.createdAt).toLocaleString('es-CO')} &bull; SOLO ENTRETENIMIENTO
        </p>
      </div>
    </main>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <div style={{ height: 2, width: 16, background: 'var(--accent)' }} />
      <span className="stat-label" style={{ color: 'var(--accent)', fontSize: 11 }}>{children}</span>
    </div>
  )
}
