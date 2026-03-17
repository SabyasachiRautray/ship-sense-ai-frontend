import React from 'react'
import { useGetAlertsQuery } from '../redux/api/shipApi'
import RiskBadge from './RiskBadge'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function AlertPanel() {
  const { data, isLoading, refetch } = useGetAlertsQuery(undefined)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className="text-red-500" />
          <h2 className="font-semibold text-slate-800">Active Alerts</h2>
          {data?.total_alerts > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
              {data.total_alerts}
            </span>
          )}
        </div>
        <button onClick={refetch} className="text-slate-400 hover:text-blue-500 transition-colors">
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
        {isLoading && (
          <div className="p-6 flex justify-center">
            <RefreshCw className="animate-spin text-blue-400" size={22} />
          </div>
        )}

        {data?.alerts?.map((alert, i) => (
          <div key={i} className="px-6 py-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono font-semibold text-blue-600 text-sm">
                {alert.shipment_id}
              </span>
              <RiskBadge level={alert.risk_level} score={alert.risk_score} />
            </div>
            <p className="text-xs text-slate-500 mb-1">
              {alert.origin} → {alert.destination} • {alert.carrier}
            </p>
            <p className="text-xs text-slate-700 font-medium capitalize">
              👉 {alert.recommendation}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Confidence: {alert.confidence}
            </p>
          </div>
        ))}

        {!isLoading && data?.total_alerts === 0 && (
          <div className="text-center py-10 text-slate-400">
            <AlertTriangle size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No active alerts</p>
          </div>
        )}
      </div>
    </div>
  )
}