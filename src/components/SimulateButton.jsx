import React, { useState } from 'react'
import { useSimulateDisruptionMutation } from '../redux/api/shipApi'
import { useGetShipmentsQuery } from '../redux/api/shipApi'
import { Zap, AlertTriangle } from 'lucide-react'

export default function SimulateButton() {
  const { data: shipments } = useGetShipmentsQuery()
  const [simulate, { isLoading }] = useSimulateDisruptionMutation()
  const [result, setResult] = useState(null)
  const [selectedId, setSelectedId] = useState('')

  const handleSimulate = async () => {
    if (!selectedId) return
    const res = await simulate(selectedId)
    if (res.data) setResult(res.data)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-red-100 p-1.5 rounded-lg">
          <Zap size={16} className="text-red-600" />
        </div>
        <h2 className="font-semibold text-slate-800">Simulate Disruption</h2>
        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Demo</span>
      </div>

      <p className="text-sm text-slate-500 mb-4">
        Instantly trigger a port strike scenario for any shipment to demonstrate live risk escalation.
      </p>

      <div className="flex gap-2">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          <option value="">Select a shipment...</option>
          {shipments?.map(s => (
            <option key={s.shipment_id} value={s.shipment_id}>
              {s.shipment_id} — {s.origin} → {s.destination}
            </option>
          ))}
        </select>
        <button
          onClick={handleSimulate}
          disabled={isLoading || !selectedId}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 flex items-center gap-1.5"
        >
          <Zap size={14} />
          {isLoading ? 'Simulating...' : 'Simulate'}
        </button>
      </div>

      {result && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-red-600" />
            <span className="text-sm font-semibold text-red-700">Disruption Triggered!</span>
          </div>
          <p className="text-xs text-red-600">{result.message}</p>
          <p className="text-xs text-slate-600 mt-1">
            Risk Score: <strong>{result.risk_score}</strong> • Level: <strong>{result.risk_level}</strong>
          </p>
          <p className="text-xs text-slate-600">Recommendation: <strong className="capitalize">{result.recommendation}</strong></p>
        </div>
      )}
    </div>
  )
}