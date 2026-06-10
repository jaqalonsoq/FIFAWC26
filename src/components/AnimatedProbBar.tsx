'use client'

import { motion } from 'framer-motion'

interface Segment {
  label: string
  value: number
  color: string
}

interface Props {
  segments: Segment[]
  height?: number
}

export default function AnimatedProbBar({ segments, height = 8 }: Props) {
  const total = segments.reduce((s, seg) => s + seg.value, 0)
  if (total === 0) return null

  return (
    <div>
      <div className="flex overflow-hidden" style={{ height, gap: 2 }}>
        {segments.map((seg, i) => (
          <motion.div
            key={seg.label}
            initial={{ width: 0 }}
            animate={{ width: `${(seg.value / total) * 100}%` }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            style={{ background: seg.color, height: '100%' }}
            title={`${seg.label}: ${seg.value.toFixed(1)}%`}
          />
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {segments.map(seg => (
          <div key={seg.label} className="text-center">
            <div style={{ color: seg.color, fontWeight: 700, fontSize: 18 }}>
              {seg.value.toFixed(0)}<span style={{ fontSize: 11 }}>%</span>
            </div>
            <div className="stat-label">{seg.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
