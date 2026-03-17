import React, { useState, useMemo } from 'react'
import { useGetShipmentsByUserQuery, useAnalyzeShipmentMutation } from '../redux/api/shipApi'
import { useAuth } from '../redux/useAuth'
import ShipmentMap from '../components/ShipmentMap'
import {
  Package, Brain, RefreshCw, X, ChevronRight,
  Truck, Plane, Ship, Cloud, AlertTriangle,
  CheckCircle, Clock, Navigation, MapPin, Search
} from 'lucide-react'

//  Recommended Route Card 
function RecommendedRouteCard({ route }) {
  if (!route) return null
  const modeConfig = {
    road:  { icon: Truck, color: 'text-orange-500', bg: 'bg-orange-50 border-orange-200' },
    air:   { icon: Plane, color: 'text-blue-500',   bg: 'bg-blue-50 border-blue-200'   },
    water: { icon: Ship,  color: 'text-teal-500',   bg: 'bg-teal-50 border-teal-200'   },
  }
  const cfg  = modeConfig[route.mode] || modeConfig.road
  const Icon = cfg.icon
  return (
    <div className={`border rounded-2xl p-4 ${cfg.bg}`}>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Recommended Route</p>
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-white/70 rounded-xl flex-shrink-0">
          <Icon size={20} className={cfg.color} />
        </div>
        <div className="flex-1">
          <span className="font-bold text-slate-800 capitalize">{route.mode} Route</span>
          <p className="text-sm text-slate-600 my-1">{route.via}</p>
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
          {route.reason && <p className="text-xs text-slate-500 mt-2 italic">{route.reason}</p>}
        </div>
      </div>
    </div>
  )
}

//  Shipment Detail Panel 
function ShipmentPanel({ shipment, onClose }) {
  const [analyze, { isLoading, data: analysis }] = useAnalyzeShipmentMutation()
  const result  = analysis?.analysis
  const signals = analysis?.signals

  const recommendationConfig = {
    'reroute shipment':           { color: 'bg-orange-50 border-orange-200 text-orange-700', icon: Navigation,    label: 'Reroute Shipment' },
    'assign alternative carrier': { color: 'bg-purple-50 border-purple-200 text-purple-700', icon: Truck,         label: 'Assign Alternative Carrier' },
    'send pre-alert to customer': { color: 'bg-blue-50 border-blue-200 text-blue-700',        icon: AlertTriangle, label: 'Send Pre-Alert to Customer' },
    'expedite dispatch':          { color: 'bg-yellow-50 border-yellow-200 text-yellow-700',  icon: Clock,         label: 'Expedite Dispatch' },
    'monitor closely':            { color: 'bg-green-50 border-green-200 text-green-700',     icon: CheckCircle,   label: 'Monitor Closely' },
  }
  const recConfig = recommendationConfig[result?.recommendation] || recommendationConfig['monitor closely']
  const RecIcon   = recConfig.icon

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

          {/* Info Grid */}
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
         

          {/* Skeleton */}
          {isLoading && (
            <div className="space-y-3 animate-pulse">
              <div className="h-28 bg-slate-200 rounded-2xl" />
              <div className="h-24 bg-slate-100 rounded-xl" />
              <div className="h-16 bg-slate-100 rounded-xl" />
            </div>
          )}

          {/* Results */}
          {result && !isLoading && (
            <div className="space-y-4">

              {/* Risk Score */}
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
                    <p className="text-white font-semibold text-lg">{result.risk_level} Risk</p>
                  </div>
                </div>
                <div className="bg-white/20 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full bg-white transition-all duration-700"
                    style={{ width: `${result.risk_score}%` }}
                  />
                </div>
                <p className="text-white/70 text-xs mt-2">Estimated delay: {result.estimated_delay_hours} hours</p>
              </div>

              {/* Recommendation */}
              <div className={`border rounded-2xl p-4 ${recConfig.color}`}>
                <p className="text-xs font-bold uppercase tracking-wide mb-2 opacity-70">Recommended Action</p>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/60 rounded-xl"><RecIcon size={20} /></div>
                  <div>
                    <p className="font-bold text-base">{recConfig.label}</p>
                    <p className="text-xs opacity-70 mt-0.5">
                      {result.risk_level === 'High' ? 'Immediate action required to prevent SLA breach' : 'Proactive measure to ensure on-time delivery'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommended Route */}
              <RecommendedRouteCard route={result.recommended_route} />

              {/* Reasons */}
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Why This Risk Level</p>
                <div className="space-y-3">
                  {result.reasons?.map((reason, i) => (
                    <div key={i} className="flex gap-3 bg-white rounded-xl p-3 shadow-sm">
                      <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        result.risk_level === 'High'   ? 'bg-red-100 text-red-600' :
                        result.risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                                                          'bg-green-100 text-green-600'
                      }`}>{i + 1}</span>
                      <p className="text-sm text-slate-700 leading-relaxed">{reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Signals */}
              {signals && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-sky-50 border border-sky-100 rounded-xl p-3.5">
                    <div className="flex items-center gap-2 mb-2">
                      <Cloud size={14} className="text-sky-500" />
                      <span className="text-xs font-bold text-slate-600">Weather</span>
                    </div>
                    <p className="text-sm font-semibold capitalize text-slate-700">{signals.weather?.description}</p>
                    <p className="text-xs text-slate-500 mt-1">{signals.weather?.temp}°C • Wind {signals.weather?.wind_speed} m/s</p>
                    <div className="mt-2 flex items-center gap-1">
                      <div className="flex-1 bg-sky-200 rounded-full h-1.5">
                        <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${(signals.weather?.severity / 10) * 100}%` }} />
                      </div>
                      <span className="text-xs text-slate-400">{signals.weather?.severity}/10</span>
                    </div>
                  </div>
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-3.5">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck size={14} className="text-orange-500" />
                      <span className="text-xs font-bold text-slate-600">Transport</span>
                    </div>
                    <p className="text-xs text-slate-500">🚛 Road: {signals.traffic?.road?.duration_hours}h</p>
                    <p className="text-xs text-slate-500 mt-0.5">✈️ Air: {signals.traffic?.air?.available ? `${signals.traffic.air.duration_hours}h` : 'N/A'}</p>
                    <p className="text-xs text-slate-500 mt-0.5">🚢 Water: {signals.traffic?.water?.available ? `${signals.traffic.water.duration_hours}h` : 'N/A'}</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-100 rounded-xl p-3.5">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle size={14} className="text-purple-500" />
                      <span className="text-xs font-bold text-slate-600">Disruptions</span>
                    </div>
                    {signals.news?.length > 0
                      ? signals.news.slice(0, 2).map((n, i) => <p key={i} className="text-xs text-slate-600 mb-1">• {n.title}</p>)
                      : <p className="text-xs text-green-600 font-medium">✓ No disruptions</p>
                    }
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

//  Main User Dashboard
export default function UserDashboard() {
  const { user }                = useAuth()
  const [selected, setSelected] = useState(null)
  const [search, setSearch]     = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const { data: shipments, isLoading } = useGetShipmentsByUserQuery(user?.id, {
    skip: !user?.id
  })

  const statusColor = {
    on_time: 'text-green-700 bg-green-50 border border-green-200',
    at_risk: 'text-yellow-700 bg-yellow-50 border border-yellow-200',
    delayed: 'text-red-700 bg-red-50 border border-red-200',
  }

  const total   = shipments?.length || 0
  const atRisk  = shipments?.filter(s => s.status === 'at_risk').length || 0
  const onTime  = shipments?.filter(s => s.status === 'on_time').length || 0
  const delayed = shipments?.filter(s => s.status === 'delayed').length || 0

  // Filter logic
  const filtered = useMemo(() => {
    if (!shipments) return []
    const q = search.toLowerCase()
    return shipments.filter(s => {
      const matchSearch =
        !q ||
        s.shipment_id.toLowerCase().includes(q)  ||
        s.origin.toLowerCase().includes(q)        ||
        s.destination.toLowerCase().includes(q)   ||
        s.carrier.toLowerCase().includes(q)
      const matchStatus =
        statusFilter === 'all' || s.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [shipments, search, statusFilter])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
          Welcome back, {user?.name} 
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Here are all your shipments and their current status
        </p>
      </div>

      {/* Stats — clickable filters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total',   value: total,   color: 'bg-blue-50',   text: 'text-blue-600',   icon: Package,       filter: 'all'     },
          { label: 'At Risk', value: atRisk,  color: 'bg-yellow-50', text: 'text-yellow-600', icon: AlertTriangle, filter: 'at_risk' },
          { label: 'Delayed', value: delayed, color: 'bg-red-50',    text: 'text-red-600',    icon: Clock,         filter: 'delayed' },
          { label: 'On Time', value: onTime,  color: 'bg-green-50',  text: 'text-green-600',  icon: CheckCircle,   filter: 'on_time' },
        ].map(({ label, value, color, text, icon: Icon, filter }) => (
          <button
            key={label}
            onClick={() => setStatusFilter(prev => prev === filter ? 'all' : filter)}
            className={`bg-white rounded-2xl border p-4 flex items-center gap-3 shadow-sm w-full text-left transition-all ${
              statusFilter === filter
                ? 'border-blue-400 ring-2 ring-blue-100'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className={`p-2.5 rounded-xl ${color}`}>
              <Icon size={18} className={text} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Search + Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3 mb-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">

        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID, origin, destination or carrier..."
            className="w-full pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700 placeholder-slate-400"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { label: 'All',     value: 'all',     color: 'bg-slate-100 text-slate-600 hover:bg-slate-200'     },
            { label: 'At Risk', value: 'at_risk', color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
            { label: 'Delayed', value: 'delayed', color: 'bg-red-100 text-red-700 hover:bg-red-200'           },
            { label: 'On Time', value: 'on_time', color: 'bg-green-100 text-green-700 hover:bg-green-200'     },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${opt.color} ${
                statusFilter === opt.value ? 'ring-2 ring-offset-1 ring-blue-400' : ''
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Count */}
        <span className="text-xs text-slate-400 whitespace-nowrap">
          {filtered.length} of {total}
        </span>
      </div>

      {/* Empty search state */}
      {filtered.length === 0 && (search || statusFilter !== 'all') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center mb-4">
          <Search size={32} className="mx-auto mb-3 text-slate-300" />
          <p className="text-slate-500 font-medium">No shipments match your search</p>
          <button
            onClick={() => { setSearch(''); setStatusFilter('all') }}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Shipment Cards */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : shipments?.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Package size={40} className="mx-auto mb-3 text-slate-300" />
          <p className="text-slate-500 font-medium">No shipments assigned to you yet</p>
          <p className="text-slate-400 text-sm mt-1">Contact your admin to get shipments added</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <div
              key={s.shipment_id}
              onClick={() => setSelected(s)}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                    s.status === 'delayed' ? 'bg-red-50' :
                    s.status === 'at_risk' ? 'bg-yellow-50' : 'bg-blue-50'
                  }`}>
                    <MapPin size={18} className={
                      s.status === 'delayed' ? 'text-red-500' :
                      s.status === 'at_risk' ? 'text-yellow-500' : 'text-blue-600'
                    } />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-blue-600 text-sm">{s.shipment_id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${statusColor[s.status]}`}>
                        {s.status?.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 mt-0.5 font-medium">
                      {s.origin} → {s.destination}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {s.carrier} • SLA: {new Date(s.sla_deadline).toLocaleString()}
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-300 flex-shrink-0 ml-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Panel */}
      {selected && (
        <ShipmentPanel
          shipment={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}