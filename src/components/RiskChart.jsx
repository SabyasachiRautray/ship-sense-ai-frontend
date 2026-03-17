import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useGetShipmentsQuery,useGetAlertsQuery } from '../redux/api/shipApi'
import { BarChart2 } from 'lucide-react'

export default function RiskChart() {
  const { data: alerts } = useGetAlertsQuery()

  const chartData = alerts?.alerts?.map(a => ({
    id:    a.shipment_id.replace('SHP-', '#'),
    score: a.risk_score,
    level: a.risk_level,
  })) || []

  const barColor = (level) => {
    if (level === 'High')   return '#ef4444'
    if (level === 'Medium') return '#f59e0b'
    return '#22c55e'
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const d = payload[0].payload
      return (
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-lg text-sm">
          <p className="font-semibold text-slate-700">Shipment {d.id}</p>
          <p className="text-slate-500">Risk Score: <span className="font-bold text-slate-800">{d.score}</span></p>
          <p className="text-slate-500">Level: <span className="font-semibold">{d.level}</span></p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <BarChart2 size={18} className="text-blue-600" />
        <h2 className="font-semibold text-slate-800">Risk Score Overview</h2>
      </div>

      {chartData.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-sm">
          Analyze shipments to see risk scores here
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="id" tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={barColor(entry.level)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 justify-center">
        {[['High', '#ef4444'], ['Medium', '#f59e0b'], ['Low', '#22c55e']].map(([label, color]) => (
          <div key={label} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}