import React, { useState } from 'react'
import { useGetMyShipmentsQuery } from '../redux/api/shipApi'
import { useAuth } from '../redux/useAuth'
import ShipmentMap from '../components/ShipmentMap'
import {
  Truck, Package, AlertTriangle, CheckCircle,
  Clock, X, ChevronRight, LogOut, MapPin,
  Navigation, Plane, Ship, Cloud, RefreshCw
} from 'lucide-react'

//  Risk color helpers 
const riskColor = {
  High:   { badge: 'bg-red-100 text-red-700 border border-red-200',    dot: 'bg-red-500'    },
  Medium: { badge: 'bg-yellow-100 text-yellow-700 border border-yellow-200', dot: 'bg-yellow-500' },
  Low:    { badge: 'bg-green-100 text-green-700 border border-green-200',  dot: 'bg-green-500'  },
}

const statusColor = {
  on_time: 'text-green-700 bg-green-50 border border-green-200',
  at_risk: 'text-yellow-700 bg-yellow-50 border border-yellow-200',
  delayed: 'text-red-700 bg-red-50 border border-red-200',
}

// ── Route mode icons ───────────────────────────────────
const modeIcon = { road: Truck, air: Plane, water: Ship }
const modeBg   = {
  road:  'bg-orange-50 border-orange-200 text-orange-700',
  air:   'bg-blue-50 border-blue-200 text-blue-700',
  water: 'bg-teal-50 border-teal-200 text-teal-700',
}

// ── SLA Countdown ──────────────────────────────────────
function SLACountdown({ slaDeadline }) {
  const now      = new Date()
  const sla      = new Date(slaDeadline)
  const hoursLeft = ((sla - now) / 3600000).toFixed(1)
  const color    = hoursLeft < 4 ? 'text-red-600' : hoursLeft < 12 ? 'text-yellow-600' : 'text-green-600'

  return (
    <span className={`text-xs font-mono font-bold ${color}`}>
      {hoursLeft > 0 ? `${hoursLeft}h until SLA` : '⚠️ SLA BREACHED'}
    </span>
  )
}

// ── Shipment Detail Modal ──────────────────────────────
function ShipmentModal({ shipment, onClose }) {
  const a     = shipment.latest_analysis
  const route = a?.recommended_route
  const ModeIcon = route?.mode ? modeIcon[route.mode] || Truck : Truck

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-800 font-mono">{shipment.shipment_id}</h2>
            <p className="text-sm text-slate-500">{shipment.origin} → {shipment.destination} • {shipment.carrier}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">

          {/* Info grid */}
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
            riskLevel={a?.risk_level}
            recommendation={a?.recommendation}
          />

          {/* No analysis yet */}
          {!a && (
            <div className="bg-slate-50 rounded-2xl p-6 text-center text-slate-400">
              <Package size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No analysis run yet. Ask your admin to analyze this shipment.</p>
            </div>
          )}

          {/* Analysis results */}
          {a && (
            <div className="space-y-4">

              {/* Risk score card */}
              <div className={`rounded-2xl p-5 text-white ${
                a.risk_level === 'High'   ? 'bg-gradient-to-r from-red-600 to-red-500' :
                a.risk_level === 'Medium' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                            'bg-gradient-to-r from-green-600 to-emerald-500'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/80 text-sm font-medium">NVIDIA Llama AI Analysis</span>
                  <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                    Confidence: {a.confidence}
                  </span>
                </div>
                <div className="flex items-end gap-3 mb-4">
                  <span className="text-6xl font-bold">{a.risk_score}</span>
                  <div className="pb-1">
                    <p className="text-white/70 text-xs">Risk Score / 100</p>
                    <p className="text-white font-semibold text-lg">{a.risk_level} Risk</p>
                  </div>
                </div>
                <div className="bg-white/20 rounded-full h-2.5">
                  <div className="h-2.5 rounded-full bg-white transition-all duration-700"
                    style={{ width: `${a.risk_score}%` }} />
                </div>
                <p className="text-white/70 text-xs mt-2">
                  Estimated delay: {a.estimated_delay_hours} hours
                </p>
              </div>

              {/* What you should do */}
              <div className={`border rounded-2xl p-4 ${
                a.risk_level === 'High'
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-blue-50 border-blue-200 text-blue-700'
              }`}>
                <p className="text-xs font-bold uppercase tracking-wide mb-2 opacity-70">
                  What You Should Do
                </p>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/60 rounded-xl">
                    <Navigation size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-base capitalize">{a.recommendation}</p>
                    <p className="text-xs opacity-70 mt-0.5">
                      {a.risk_level === 'High'
                        ? 'Immediate action required — contact your logistics manager'
                        : 'Proceed with caution — monitor updates'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommended route */}
              {route && (
                <div className={`border rounded-2xl p-4 ${modeBg[route.mode] || modeBg.road}`}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-3 opacity-70">
                    Recommended Route
                  </p>
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-white/70 rounded-xl flex-shrink-0">
                      <ModeIcon size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-800 capitalize mb-1">{route.mode} Route</p>
                      <p className="text-sm text-slate-600 mb-2">{route.via}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/60 rounded-lg p-2 text-center">
                          <p className="text-xs text-slate-400">Duration</p>
                          <p className="text-sm font-bold text-slate-700">{route.estimated_hours}h</p>
                        </div>
                        <div className="bg-white/60 rounded-lg p-2 text-center">
                          <p className="text-xs text-slate-400">Time Saved</p>
                          <p className="text-sm font-bold text-green-600">
                            {route.time_saved_hours > 0 ? `${route.time_saved_hours}h faster` : 'Best option'}
                          </p>
                        </div>
                      </div>
                      {route.reason && (
                        <p className="text-xs text-slate-500 mt-2 italic">{route.reason}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Reasons */}
              {a.reasons?.length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                    Why This Risk Level
                  </p>
                  <div className="space-y-2">
                    {a.reasons.map((reason, i) => (
                      <div key={i} className="flex gap-3 bg-white rounded-xl p-3 shadow-sm">
                        <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          a.risk_level === 'High'   ? 'bg-red-100 text-red-600' :
                          a.risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                                                      'bg-green-100 text-green-600'
                        }`}>{i + 1}</span>
                        <p className="text-sm text-slate-700 leading-relaxed">{reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main Partner Dashboard ─────────────────────────────
export default function PartnerDashboard() {
  const { partner, logout }               = useAuth()
  const [selected, setSelected]           = useState(null)
  const [statusFilter, setStatusFilter]   = useState('all')

  const { data, isLoading, refetch } = useGetMyShipmentsQuery()

  const shipments = data?.shipments || []

  const total   = shipments.length
  const atRisk  = shipments.filter(s => s.status === 'at_risk').length
  const delayed = shipments.filter(s => s.status === 'delayed').length
  const onTime  = shipments.filter(s => s.status === 'on_time').length
  const highRisk = shipments.filter(s => s.latest_analysis?.risk_level === 'High').length

  const filtered = statusFilter === 'all'
    ? shipments
    : shipments.filter(s => s.status === statusFilter)

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Partner Navbar */}
      <nav className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 p-2 rounded-lg">
            <Truck className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">ShipSense AI</h1>
            <p className="text-xs text-slate-400">Delivery Partner Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {highRisk > 0 && (
            <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
              <AlertTriangle size={14} className="text-red-500" />
              <span className="text-xs font-semibold text-red-600">{highRisk} High Risk</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold">
              {partner?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-700 leading-none">{partner?.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{partner?.phone}</p>
            </div>
          </div>
          <button onClick={logout}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
            <LogOut size={15} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Welcome */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            Hey {partner?.name?.split(' ')[0]} 
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Here are all your assigned shipments and their current risk status.
          </p>
        </div>

        {/* High risk banner */}
        {highRisk > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-700">
                {highRisk} shipment{highRisk > 1 ? 's' : ''} on your route {highRisk > 1 ? 'are' : 'is'} at HIGH RISK
              </p>
              <p className="text-xs text-red-500 mt-0.5">
                Click on the shipment below to see the recommended action and alternate route.
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total',    value: total,   icon: Package,       bg: 'bg-blue-50',   text: 'text-blue-600',   filter: 'all'     },
            { label: 'At Risk',  value: atRisk,  icon: AlertTriangle, bg: 'bg-yellow-50', text: 'text-yellow-600', filter: 'at_risk' },
            { label: 'Delayed',  value: delayed, icon: Clock,         bg: 'bg-red-50',    text: 'text-red-600',    filter: 'delayed' },
            { label: 'On Time',  value: onTime,  icon: CheckCircle,   bg: 'bg-green-50',  text: 'text-green-600',  filter: 'on_time' },
          ].map(({ label, value, icon: Icon, bg, text, filter }) => (
            <button key={label}
              onClick={() => setStatusFilter(prev => prev === filter ? 'all' : filter)}
              className={`bg-white rounded-2xl border p-4 flex items-center gap-3 w-full text-left transition-all shadow-sm ${
                statusFilter === filter
                  ? 'border-blue-400 ring-2 ring-blue-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}>
              <div className={`p-2.5 rounded-xl ${bg}`}>
                <Icon size={16} className={text} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Refresh button */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-slate-700">
            {filtered.length} shipment{filtered.length !== 1 ? 's' : ''}
            {statusFilter !== 'all' && ` · ${statusFilter.replace('_', ' ')}`}
          </p>
          <button onClick={refetch}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-500 transition-colors">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && shipments.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Truck size={40} className="mx-auto mb-3 text-slate-300" />
            <p className="text-slate-500 font-medium">No shipments assigned to you yet</p>
            <p className="text-slate-400 text-sm mt-1">Your admin will assign shipments to your account</p>
          </div>
        )}

        {/* Shipment cards */}
        {!isLoading && (
          <div className="space-y-3">
            {filtered.map((s) => {
              const a         = s.latest_analysis
              const risk      = a?.risk_level
              const riskStyle = riskColor[risk] || riskColor.Low

              return (
                <div key={s.shipment_id} onClick={() => setSelected(s)}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">

                      {/* Status dot */}
                      <div className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        s.status === 'delayed' ? 'bg-red-500' :
                        s.status === 'at_risk' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-mono font-bold text-blue-600 text-sm">{s.shipment_id}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${statusColor[s.status]}`}>
                            {s.status?.replace('_', ' ')}
                          </span>
                          {risk && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${riskStyle.badge}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${riskStyle.dot}`} />
                              {risk} Risk {a?.risk_score && `(${a.risk_score})`}
                            </span>
                          )}
                        </div>

                        <p className="text-sm font-semibold text-slate-700">
                          <MapPin size={12} className="inline mr-1 text-slate-400" />
                          {s.origin} → {s.destination}
                        </p>

                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          <p className="text-xs text-slate-400">{s.carrier}</p>
                          <SLACountdown slaDeadline={s.sla_deadline} />
                        </div>

                        {/* Recommendation pill if analyzed */}
                        {a?.recommendation && (
                          <div className="mt-2 inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
                            <Navigation size={11} className="text-slate-400" />
                            <span className="text-xs text-slate-600 font-medium capitalize">{a.recommendation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 flex-shrink-0 mt-1" />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <ShipmentModal
          shipment={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}