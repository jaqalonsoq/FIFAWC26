'use client'

import type { ScoreDistributionEntry } from '@/lib/types'

interface Props {
  data: ScoreDistributionEntry[]
  homeCode: string
  awayCode: string
}

export default function ScoreHeatmap({ data, homeCode, awayCode }: Props) {
  if (!data.length) return null

  const maxProb = Math.max(...data.map(d => d.probability))

  const maxGoal = data.reduce((max, d) => {
    const [h, a] = d.score.split('-').map(Number)
    return Math.max(max, h, a)
  }, 4)

  const grid: Record<string, number> = {}
  for (const d of data) {
    grid[d.score] = d.probability
  }

  const rows = Array.from({ length: maxGoal + 1 }, (_, i) => i)
  const cols = Array.from({ length: maxGoal + 1 }, (_, i) => i)

  return (
    <div>
      <div className="stat-label mb-3">{homeCode} (vertical) vs {awayCode} (horizontal)</div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr>
              <th style={{ width: 28, color: 'var(--text-muted)', padding: '2px 6px' }}></th>
              {cols.map(a => (
                <th key={a} style={{ width: 40, color: 'var(--text-muted)', padding: '4px 6px', textAlign: 'center' }}>{a}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(h => (
              <tr key={h}>
                <td style={{ color: 'var(--text-muted)', padding: '2px 6px', textAlign: 'right' }}>{h}</td>
                {cols.map(a => {
                  const p = grid[`${h}-${a}`] || 0
                  const intensity = maxProb > 0 ? p / maxProb : 0
                  const isTop = p === maxProb && maxProb > 0
                  return (
                    <td
                      key={a}
                      style={{
                        width: 40,
                        height: 32,
                        textAlign: 'center',
                        background: isTop
                          ? 'var(--accent)'
                          : `rgba(0, 229, 160, ${intensity * 0.6})`,
                        color: isTop ? 'var(--bg)' : intensity > 0.5 ? 'var(--bg)' : 'var(--text-secondary)',
                        fontWeight: isTop ? 700 : 400,
                        fontSize: 11,
                        border: '1px solid var(--border)',
                      }}
                      title={`${h}-${a}: ${(p * 100).toFixed(1)}%`}
                    >
                      {p > 0 ? (p * 100).toFixed(1) : ''}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
