import Link from 'next/link'
import { fetchAllMatches, fetchChampionOdds } from '@/lib/actions'
import MatchCard from '@/components/MatchCard'
import { GROUPS } from '@/lib/data/wc2026-teams'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [matches, odds] = await Promise.all([
    fetchAllMatches(),
    fetchChampionOdds(),
  ])

  const grouped: Record<string, typeof matches> = {}
  for (const m of matches) {
    const key = m.group ?? m.stage
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(m)
  }

  const topChampions = Object.entries(odds.championOdds)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '32px 16px' }}>
      <header style={{ marginBottom: 48 }}>
        <div className="stat-label" style={{ color: 'var(--accent)', marginBottom: 8 }}>
          FIFA WORLD CUP 2026 &bull; ANÁLISIS IA &bull; {new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long' }).toUpperCase()}
        </div>
        <h1 style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1, color: 'var(--text-primary)', margin: 0 }}>
          PREDICTOR<br />
          <span style={{ color: 'var(--accent)' }}>MUNDIAL 2026</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 16, maxWidth: 520, lineHeight: 1.6 }}>
          Proyecciones estadísticas con Poisson + ELO. {matches.length} partidos &bull; {GROUPS.length} grupos &bull; 48 selecciones. Solo entretenimiento.
        </p>
      </header>

      <section style={{ marginBottom: 48 }}>
        <SectionTitle>PROYECCIÓN DE CAMPEÓN &bull; MONTE CARLO {odds.runs.toLocaleString()} SIMULACIONES</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, marginBottom: 8 }}>
          {topChampions.map(([code, pct], i) => {
            const team = matches.flatMap(m => [m.homeTeam, m.awayTeam]).find(t => t.code === code)
            return (
              <div
                key={code}
                style={{
                  padding: '14px 12px',
                  border: i === 0 ? '1px solid var(--accent)' : '1px solid var(--border)',
                  background: i === 0 ? 'var(--accent-dim)' : 'var(--surface)',
                }}
              >
                <div style={{ fontSize: 22 }}>{team?.flag ?? ''}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: i === 0 ? 'var(--accent)' : 'var(--text-primary)', marginTop: 4 }}>
                  {pct.toFixed(1)}<span style={{ fontSize: 12, fontWeight: 400 }}>%</span>
                </div>
                <div className="stat-label" style={{ marginTop: 2 }}>{code}</div>
                {i === 0 && <div className="stat-label" style={{ color: 'var(--accent)', marginTop: 4 }}>FAVORITO</div>}
              </div>
            )
          })}
        </div>
      </section>

      <section style={{ marginBottom: 48 }}>
        <SectionTitle>GRUPOS</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4 }}>
          {GROUPS.map(g => (
            <Link key={g} href={`/grupo/${g}`} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '14px 10px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                textAlign: 'center',
                transition: 'border-color 0.15s',
              }}
                className="hover:border-[var(--accent)]"
              >
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent)' }}>{g}</div>
                <div className="stat-label" style={{ marginTop: 4 }}>VER GRUPO</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {GROUPS.map(group => {
        const groupMatches = grouped[group] ?? []
        if (!groupMatches.length) return null
        return (
          <section key={group} style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ height: 2, width: 20, background: 'var(--accent)' }} />
              <Link href={`/grupo/${group}`} style={{ textDecoration: 'none' }}>
                <span className="stat-label" style={{ color: 'var(--accent)', fontSize: 11 }}>
                  GRUPO {group} &rarr;
                </span>
              </Link>
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              {groupMatches.map(m => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          </section>
        )
      })}

      <footer style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
        <p className="stat-label">
          MODELO: ELO + DISTRIBUCIÓN DE POISSON + MONTE CARLO &bull; DATOS: API-FOOTBALL &bull; SOLO ANÁLISIS DE ENTRETENIMIENTO
        </p>
      </footer>
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
