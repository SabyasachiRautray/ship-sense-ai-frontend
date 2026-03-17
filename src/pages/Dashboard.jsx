import React, { useState, useMemo } from 'react'
import ShipmentTable from '../components/ShipmentTable'
import AlertPanel from '../components/AlertPanel'
import ShipmentDetail from '../components/ShipmentDetail'
import RiskChart from '../components/RiskChart'
import AddShipmentModal from '../components/AddShipmentModal'
import CreatePartnerModal from '../components/CreatePartnerModal'
import { useGetShipmentsQuery, useGetAlertsQuery } from '../redux/api/shipApi'
import { useAuth } from '../redux/useAuth'
import { Package, AlertTriangle, CheckCircle, TrendingUp, Plus, Search, X, Truck } from 'lucide-react'

export default function Dashboard() {
  const [selectedShipment, setSelectedShipment] = useState(null)
  const [showAddModal, setShowAddModal]           = useState(false)
  const [showPartnerModal, setShowPartnerModal]   = useState(false)
  const [search, setSearch]                       = useState('')
  const [statusFilter, setStatusFilter]           = useState('all')

  const { data: shipments } = useGetShipmentsQuery()
  const { data: alertsData } = useGetAlertsQuery()
  const { isAdmin }          = useAuth()

  const total   = shipments?.length || 0
  const atRisk  = shipments?.filter(s => s.status === 'at_risk').length || 0
  const delayed = shipments?.filter(s => s.status === 'delayed').length || 0
  const onTime  = shipments?.filter(s => s.status === 'on_time').length || 0

  const filteredShipments = useMemo(() => {
    if (!shipments) return []
    const q = search.toLowerCase()
    return shipments.filter(s => {
      const matchesSearch =
        !q ||
        s.shipment_id.toLowerCase().includes(q)  ||
        s.origin.toLowerCase().includes(q)        ||
        s.destination.toLowerCase().includes(q)   ||
        s.carrier.toLowerCase().includes(q)
      const matchesStatus =
        statusFilter === 'all' || s.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [shipments, search, statusFilter])

  const stats = [
    { label: 'Total',   value: total,   icon: Package,       bg: 'bg-blue-50',   text: 'text-blue-600',   filter: 'all'     },
    { label: 'At Risk', value: atRisk,  icon: TrendingUp,    bg: 'bg-yellow-50', text: 'text-yellow-600', filter: 'at_risk' },
    { label: 'Delayed', value: delayed, icon: AlertTriangle, bg: 'bg-red-50',    text: 'text-red-600',    filter: 'delayed' },
    { label: 'On Time', value: onTime,  icon: CheckCircle,   bg: 'bg-green-50',  text: 'text-green-600',  filter: 'on_time' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 min-h-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {isAdmin ? 'Monitoring all shipments' : 'Your shipment overview'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Add Partner button — admin only */}
          {isAdmin && (
            <button
              onClick={() => setShowPartnerModal(true)}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-orange-200"
            >
              <Truck size={16} />
              <span className="hidden sm:inline">Add Partner</span>
              <span className="sm:hidden">Partner</span>
            </button>
          )}
          {/* Add Shipment button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-blue-200"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Shipment</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {stats.map(({ label, value, icon: Icon, bg, text, filter }) => (
          <button
            key={label}
            onClick={() => setStatusFilter(prev => prev === filter ? 'all' : filter)}
            className={`bg-white rounded-2xl shadow-sm border p-4 sm:p-5 flex items-center gap-3 sm:gap-4 w-full text-left transition-all ${
              statusFilter === filter
                ? 'border-blue-400 ring-2 ring-blue-100'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className={`p-2.5 sm:p-3 rounded-xl ${bg}`}>
              <Icon size={18} className={text} />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-slate-800">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Search + Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3 mb-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
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
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { label: 'All',     value: 'all',     color: 'bg-slate-100 text-slate-600 hover:bg-slate-200' },
            { label: 'At Risk', value: 'at_risk', color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
            { label: 'Delayed', value: 'delayed', color: 'bg-red-100 text-red-700 hover:bg-red-200'         },
            { label: 'On Time', value: 'on_time', color: 'bg-green-100 text-green-700 hover:bg-green-200'   },
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
        <span className="text-xs text-slate-400 whitespace-nowrap">
          {filteredShipments.length} of {total} shipments
        </span>
      </div>

      {/* No results */}
      {filteredShipments.length === 0 && (search || statusFilter !== 'all') && (
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <ShipmentTable
            onSelect={setSelectedShipment}
            filteredShipments={filteredShipments}
          />
          <RiskChart />
        </div>
        <div className="space-y-4 sm:space-y-6">
          <AlertPanel />
        </div>
      </div>

      {/* Modals */}
      {selectedShipment && (
        <ShipmentDetail
          shipment={selectedShipment}
          onClose={() => setSelectedShipment(null)}
        />
      )}
      {showAddModal && (
        <AddShipmentModal onClose={() => setShowAddModal(false)} />
      )}
      {showPartnerModal && (
        <CreatePartnerModal onClose={() => setShowPartnerModal(false)} />
      )}
    </div>
  )
}