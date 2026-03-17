import React from 'react'
import { useAnalyzeShipmentMutation } from '../redux/api/shipApi'
import RiskBadge from './RiskBadge'
import ShipmentMap from './ShipmentMap'
import {
  Brain, Truck, Cloud, X, RefreshCw,
  AlertTriangle, CheckCircle, Clock, Navigation,
  Plane, Ship, Clock3
} from 'lucide-react'

export default function ShipmentDetail({ shipment, onClose, prefetchedAnalysis }) {
  const [analyze, { isLoading, data: freshAnalysis }] = useAnalyzeShipmentMutation()

  if (!shipment) return null


  const analysis = freshAnalysis || (prefetchedAnalysis ? { analysis: prefetchedAnalysis.analysis, signals: prefetchedAnalysis.signals } : null)
  const result   = analysis?.analysis
  const signals  = analysis?.signals

  const recommendationConfig = {
    'reroute shipment':           { color: 'bg-orange-50 border-orange-200 text-orange-700', icon: Navigation,    label: 'Reroute Shipment' },
    'assign alternative carrier': { color: 'bg-purple-50 border-purple-200 text-purple-700', icon: Truck,         label: 'Assign Alternative Carrier' },
    'send pre-alert to customer': { color: 'bg-blue-50 border-blue-200 text-blue-700',        icon: AlertTriangle, label: 'Send Pre-Alert to Customer' },
    'expedite dispatch':          { color: 'bg-yellow-50 border-yellow-200 text-yellow-700',  icon: Clock,         label: 'Expedite Dispatch' },
    'monitor closely':            { color: 'bg-green-50 border-green-200 text-green-700',     icon: CheckCircle,   label: 'Monitor Closely' },
  }

  const modeConfig = {
    road:  { icon: Truck,  color: 'text-orange-500', bg: 'bg-orange-50 border-orange-200', label: 'Road' },
    air:   { icon: Plane,  color: 'text-blue-500',   bg: 'bg-blue-50 border-blue-200',     label: 'Air'  },
    water: { icon: Ship,   color: 'text-teal-500',   bg: 'bg-teal-50 border-teal-200',     label: 'Water'},
  }

  const recConfig  = recommendationConfig[result?.recommendation] || recommendationConfig['monitor closely']
  const RecIcon    = recConfig.icon
  const route      = result?.recommended_route
  const routeMode  = modeConfig[route?.mode] || modeConfig.road
  const RouteModeIcon = routeMode.icon

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-800 font-mono">{shipment.shipment_id}</h2>
            <p className="text-sm text-slate-500">{shipment.origin} → {shipment.destination} • {shipment.carrier}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">

          {/* Shipment Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Origin',       value: shipment.origin },
              { label: 'Destination',  value: shipment.destination },
              { label: 'ETA',          value: new Date(shipment.eta).toLocaleString() },
              { label: 'SLA Deadline', value: new Date(shipment.sla_deadline).toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{label}</p>
                <p className="text-sm font-semibold text-slate-700">{value}</p>
              </div>
            ))}
          </div>

          {/* Map */}
          <ShipmentMap
            origin={shipment.origin}
            destination={shipment.destination}
            riskLevel={result?.risk_level}
            recommendation={result?.recommendation}
          />

          {/* Analyze Button */}
          {!result && (
            <button
              onClick={() => analyze(shipment.shipment_id)}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-sm shadow-blue-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <div className="text-left">
                    <p className="text-sm font-semibold">Analyzing with NVIDIA Llama AI...</p>
                    <p className="text-xs text-blue-200">Fetching live weather, traffic & news</p>
                  </div>
                </div>
              ) : (
                <><Brain size={18} /> Run AI Analysis</>
              )}
            </button>
          )}

          {/* Loading skeleton */}
          {isLoading && (
            <div className="space-y-3 animate-pulse">
              <div className="h-28 bg-slate-200 rounded-2xl" />
              <div className="h-24 bg-slate-100 rounded-xl" />
              <div className="h-16 bg-slate-100 rounded-xl" />
            </div>
          )}

          {/* Analysis Result */}
          {result && !isLoading && (
            <div className="space-y-4">

              {/* Risk Score Card */}
              <div className={`rounded-2xl p-5 text-white ${
                result.risk_level === 'High'   ? 'bg-gradient-to-r from-red-600 to-red-500' :
                result.risk_level === 'Medium' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                                  'bg-gradient-to-r from-green-600 to-emerald-500'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/80 text-sm font-medium">NVIDIA Llama AI Analysis</span>
                  <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                    Confidence: {result.confidence}
                  </span>
                </div>
                <div className="flex items-end gap-3 mb-4">
                  <span className="text-6xl font-bold">{result.risk_score}</span>
                  <div className="pb-1">
                    <p className="text-white/70 text-xs">Risk Score / 100</p>
                    <p className="text-white font-semibold text-lg capitalize">{result.risk_level} Risk</p>
                  </div>
                </div>
                <div className="bg-white/20 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full bg-white transition-all duration-700"
                    style={{ width: `${result.risk_score}%` }}
                  />
                </div>
                <p className="text-white/70 text-xs mt-2">
                  Estimated delay: {result.estimated_delay_hours} hours
                </p>
              </div>

              {/* Recommendation Card */}
              <div className={`border rounded-2xl p-4 ${recConfig.color}`}>
                <p className="text-xs font-bold uppercase tracking-wide mb-2 opacity-70">
                  Recommended Action
                </p>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/60 rounded-xl">
                    <RecIcon size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-base">{recConfig.label}</p>
                    <p className="text-xs opacity-70 mt-0.5">
                      {result.risk_level === 'High'
                        ? 'Immediate action required to prevent SLA breach'
                        : 'Proactive measure to ensure on-time delivery'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommended Route Card — NEW */}
              {route && (
                <div className={`border rounded-2xl p-4 ${routeMode.bg}`}>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                    Recommended Route
                  </p>
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-white/70 rounded-xl flex-shrink-0">
                      <RouteModeIcon size={20} className={routeMode.color} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-800 text-base capitalize">{route.mode} Route</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold bg-white/70 ${routeMode.color}`}>
                          {routeMode.label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{route.via}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/60 rounded-lg p-2 text-center">
                          <p className="text-xs text-slate-400">Duration</p>
                          <p className="text-sm font-bold text-slate-700">{route.estimated_hours}h</p>
                        </div>
                        <div className="bg-white/60 rounded-lg p-2 text-center">
                          <p className="text-xs text-slate-400">Time Saved</p>
                          <p className="text-sm font-bold text-green-600">
                            {route.time_saved_hours > 0 ? `${route.time_saved_hours}h faster` : 'Current best'}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 italic">{route.reason}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Why this risk — Reasons */}
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                  Why This Risk Level
                </p>
                <div className="space-y-3">
                  {result.reasons?.map((reason, i) => (
                    <div key={i} className="flex gap-3 bg-white rounded-xl p-3 shadow-sm">
                      <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        result.risk_level === 'High'   ? 'bg-red-100 text-red-600' :
                        result.risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                                                          'bg-green-100 text-green-600'
                      }`}>
                        {i + 1}
                      </span>
                      <p className="text-sm text-slate-700 leading-relaxed">{reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Signals */}
              {signals && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                    Live Signals Used
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                    {/* Weather */}
                    <div className="bg-sky-50 border border-sky-100 rounded-xl p-3.5">
                      <div className="flex items-center gap-2 mb-2">
                        <Cloud size={14} className="text-sky-500" />
                        <span className="text-xs font-bold text-slate-600">Weather</span>
                      </div>
                      <p className="text-sm font-semibold capitalize text-slate-700">
                        {signals.weather?.description}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{signals.weather?.temp}°C</p>
                      <p className="text-xs text-slate-500">Wind: {signals.weather?.wind_speed} m/s</p>
                      <div className="mt-2 flex items-center gap-1">
                        <div className="flex-1 bg-sky-200 rounded-full h-1.5">
                          <div
                            className="bg-sky-500 h-1.5 rounded-full"
                            style={{ width: `${(signals.weather?.severity / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400">{signals.weather?.severity}/10</span>
                      </div>
                    </div>

                    {/* Traffic — now shows all 3 modes */}
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-3.5">
                      <div className="flex items-center gap-2 mb-2">
                        <Truck size={14} className="text-orange-500" />
                        <span className="text-xs font-bold text-slate-600">Transport</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        🚛 Road: {signals.traffic?.road?.duration_hours}h
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        ✈️ Air: {signals.traffic?.air?.available ? `${signals.traffic.air.duration_hours}h` : 'N/A'}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        🚢 Water: {signals.traffic?.water?.available ? `${signals.traffic.water.duration_hours}h` : 'N/A'}
                      </p>
                      <span className={`mt-2 inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                        signals.traffic?.road?.congestion_level === 'High'   ? 'bg-red-100 text-red-600' :
                        signals.traffic?.road?.congestion_level === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                                                                                'bg-green-100 text-green-600'
                      }`}>
                        {signals.traffic?.road?.congestion_level} Congestion
                      </span>
                    </div>

                    {/* News */}
                    <div className="bg-purple-50 border border-purple-100 rounded-xl p-3.5">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle size={14} className="text-purple-500" />
                        <span className="text-xs font-bold text-slate-600">Disruptions</span>
                      </div>
                      {signals.news?.length > 0 ? (
                        signals.news.slice(0, 2).map((n, i) => (
                          <p key={i} className="text-xs text-slate-600 mb-1 leading-relaxed">
                            • {n.title}
                          </p>
                        ))
                      ) : (
                        <p className="text-xs text-green-600 font-medium">✓ No disruptions found</p>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* Re-analyze */}
              <button
                onClick={() => analyze(shipment.shipment_id)}
                disabled={isLoading}
                className="w-full border border-slate-200 text-slate-600 hover:bg-slate-50 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} /> Re-analyze with Latest Data
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}