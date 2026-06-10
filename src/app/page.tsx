import { fetchAllMatches } from '@/lib/actions'
import MatchCard from '@/components/MatchCard'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const matches = await fetchAllMatches()

  const grouped: Record<string, typeof matches> = {}
  for (const m of matches) {
    const key = m.group ?? m.stage
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(m)
  }

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px' }}>
      <header style={{ marginBottom: 48 }}>
        <div className="stat-label" style={{ color: 'var(--accent)', marginBottom: 8 }}>
          FIFA WORLD CUP 2026 &bull; ANÁLISIS IA
        </div>
        <h1 style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1, color: 'var(--text-primary)', margin: 0 }}>
          PREDICTOR<br />
          <span style={{ color: 'var(--accent)' }}>MUNDIAL</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 16, maxWidth: 480, lineHeight: 1.6 }}>
          Proyecciones estadísticas con distribución de Poisson y ELO. Todas las probabilidades calculadas en tiempo real. Solo para entretenimiento.
        </p>
      </header>

      {Object.entries(grouped).map(([group, groupMatches]) => (
        <section key={group} style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ height: 2, width: 24, background: 'var(--accent)' }} />
            <span className="stat-label" style={{ color: 'var(--accent)', fontSize: 11 }}>
              GRUPO {group}
            </span>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            {groupMatches.map(m => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      ))}

      <footer style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
        <p className="stat-label">
          MODELO: ELO + DISTRIBUCIÓN DE POISSON &bull; DATOS: API-FOOTBALL &bull; SOLO ENTRETENIMIENTO
        </p>
      </footer>
    </main>
  )
}
