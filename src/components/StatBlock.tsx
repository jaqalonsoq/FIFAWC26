interface Props {
  label: string
  value: string | number
  unit?: string
  accent?: boolean
  sub?: string
}

export default function StatBlock({ label, value, unit, accent, sub }: Props) {
  return (
    <div style={{
      padding: '16px',
      border: '1px solid var(--border)',
      background: accent ? 'var(--accent-dim)' : 'var(--surface)',
    }}>
      <div className="stat-label">{label}</div>
      <div style={{
        fontSize: 32,
        fontWeight: 800,
        lineHeight: 1,
        marginTop: 8,
        color: accent ? 'var(--accent)' : 'var(--text-primary)',
        letterSpacing: '-0.02em',
      }}>
        {value}
        {unit && <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 4 }}>{unit}</span>}
      </div>
      {sub && <div className="stat-label mt-2">{sub}</div>}
    </div>
  )
}
