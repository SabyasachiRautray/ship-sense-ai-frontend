import React from 'react'

export default function RiskBadge({ level, score }) {
  const styles = {
    High:   'bg-red-100 text-red-700 border border-red-200',
    Medium: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    Low:    'bg-green-100 text-green-700 border border-green-200',
  }

  const dots = {
    High:   'bg-red-500',
    Medium: 'bg-yellow-500',
    Low:    'bg-green-500',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[level] || styles.Low}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[level] || dots.Low}`} />
      {level} {score !== undefined && `(${score})`}
    </span>
  )
}