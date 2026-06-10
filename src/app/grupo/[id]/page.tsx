import Link from 'next/link'
import { fetchGroupData } from '@/lib/actions'
import { getProjectedGroupStandings } from '@/lib/model/montecarlo'
import { WC2026_TEAMS, GROUPS } from '@/lib/data/wc2026-teams'
import MatchCard from '@/components/MatchCard'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function GrupoPage({ params }: Props) {
  const { id } = await params
  const group = id.toUpperCase()

  if (!GROUPS.includes(group)) {
    return (
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px' }}>
        <p className="stat-label">Grupo no encontrado</p>
      </main>
    )
  }

  const teams = WC2026_TEAMS.filter(t => t.group === group)
  const standings = getProjectedGroupStandings(teams)
  const { matches } = await fetchGroupData(group)

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px' }}>
      <Link href="/" style={{ display: 'inline-block', marginBottom: 24, color: 'var(--text-muted)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
        &larr; Todos los grupos
      </Link>

      <header style={{ marginBottom: 40 }}>
        <div className="stat-label" style={{ color: 'var(--accent)', marginBottom: 8 }}>FIFA WORLD CUP 2026</div>
        <h1 style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, margin: 0 }}>
          GRUPO <span style={{ color: 'var(--accent)' }}>{group}</span>
        </h1>
      </header>

      <section style={{ marginBottom: 40 }}>
        <SectionTitle>CLASIFICACIÓN PROYECTADA &bull; 5.000 SIMULACIONES</SectionTitle>
        <div style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '28px 1fr 32px 32px 32px 32px 36px 36px 40px',
            gap: 0,
            padding: '8px 16px',
            borderBottom: '1px solid var(--border)',
          }}>
            {['#', 'EQUIPO', 'J', 'G', 'E', 'P', 'GF', 'GC', 'PTS'].map(h => (
              <div key={h} className="stat-label" style={{ textAlign: h === 'EQUIPO' ? 'left' : 'center' }}>{h}</div>
            ))}
          </div>
          {standings.map((row, i) => (
            <div
              key={row.team.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '28px 1fr 32px 32px 32px 32px 36px 36px 40px',
                gap: 0,
                padding: '12px 16px',
                borderBottom: i < standings.length - 1 ? '1px solid var(--border)' : undefined,
                background: i < 2 ? 'rgba(0,229,160,0.04)' : undefined,
              }}
            >
              <div style={{ color: i < 2 ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 700, fontSize: 13 }}>{i + 1}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>{row.team.flag}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{row.team.code}</div>
                  <div className="stat-label" style={{ fontSize: 9 }}>{row.team.name}</div>
                </div>
              </div>
              {[row.played, row.won, row.drawn, row.lost, row.gf, row.ga].map((v, j) => (
                <div key={j} style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>{typeof v === 'number' ? v.toFixed(v % 1 === 0 ? 0 : 1) : v}</div>
              ))}
              <div style={{ textAlign: 'center', fontWeight: 800, fontSize: 16, color: i < 2 ? 'var(--accent)' : 'var(--text-primary)' }}>
                {row.pts.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
        <div className="stat-label" style={{ marginTop: 8 }}>
          Valores promedio de 5.000 simulaciones. Los 2 primeros clasifican.
        </div>
      </section>

      <section>
        <SectionTitle>PARTIDOS DEL GRUPO {group}</SectionTitle>
        <div style={{ display: 'grid', gap: 6 }}>
          {matches.map(m => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      </section>

      <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
        <p className="stat-label">PROYECCIONES CALCULADAS CON MONTE CARLO + POISSON + ELO &bull; SOLO ENTRETENIMIENTO</p>
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
