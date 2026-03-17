import React, { useState } from 'react'
import { useGetShipmentsQuery, useAnalyzeShipmentMutation, useDeleteShipmentMutation } from '../redux/api/shipApi'
import ShipmentDetail from './ShipmentDetail'
import { RefreshCw, Package, Trash2, Brain } from 'lucide-react'
import { useAuth } from '../redux/useAuth'

export default function ShipmentTable({ onSelect, filteredShipments }) {
  const { isLoading, refetch }              = useGetShipmentsQuery()
  const [analyze, { isLoading: analyzing }] = useAnalyzeShipmentMutation()
  const [deleteShipment]                    = useDeleteShipmentMutation()
  const [analyzingId, setAnalyzingId]       = useState(null)
  const [detailShipment, setDetailShipment] = useState(null)
  const [prefetchedAnalysis, setPrefetchedAnalysis] = useState(null)
  const { isAdmin }                         = useAuth()

  const shipments = filteredShipments

  const handleAnalyze = async (e, shipment) => {
    e.stopPropagation()
    setAnalyzingId(shipment.shipment_id)
    try {
      const result = await analyze(shipment.shipment_id).unwrap()
      setPrefetchedAnalysis(result)
      setDetailShipment(shipment)
    } catch (err) {
      console.error('Analysis failed:', err)
    } finally {
      setAnalyzingId(null)
    }
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    if (confirm(`Delete shipment ${id}?`)) await deleteShipment(id)
  }

  const statusColor = {
    on_time: 'text-green-700 bg-green-50 border border-green-200',
    at_risk: 'text-yellow-700 bg-yellow-50 border border-yellow-200',
    delayed: 'text-red-700 bg-red-50 border border-red-200',
  }

  if (isLoading) return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <div className="space-y-3 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 bg-slate-100 rounded-xl" />
        ))}
      </div>
    </div>
  )

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package size={18} className="text-blue-600" />
            <h2 className="font-semibold text-slate-800">
              {isAdmin ? 'All Shipments' : 'My Shipments'}
            </h2>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
              {shipments?.length || 0}
            </span>
          </div>
          <button onClick={refetch} className="text-slate-400 hover:text-blue-500 transition-colors">
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-slate-50">
          {shipments?.map((s) => (
            <div key={s.shipment_id} onClick={() => onSelect(s)}
              className="px-5 py-4 hover:bg-slate-50 cursor-pointer transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-blue-600 text-sm">{s.shipment_id}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColor[s.status]}`}>
                  {s.status?.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-slate-600">{s.origin} → {s.destination}</p>
              <p className="text-xs text-slate-400 mt-1">{s.carrier}</p>
              <div className="flex gap-2 mt-3" onClick={e => e.stopPropagation()}>
                <button
                  onClick={(e) => handleAnalyze(e, s)}
                  disabled={analyzingId === s.shipment_id}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg disabled:opacity-50"
                >
                  {analyzingId === s.shipment_id ? (
                    <><span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> Analyzing...</>
                  ) : (
                    <><Brain size={12} /> Analyze</>
                  )}
                </button>
                {isAdmin && (
                  <button onClick={(e) => handleDelete(e, s.shipment_id)}
                    className="text-xs text-red-400 hover:text-red-600 px-2 py-1.5 rounded-lg hover:bg-red-50">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100">
                <th className="px-6 py-3">Shipment ID</th>
                <th className="px-6 py-3">Route</th>
                <th className="px-6 py-3">Carrier</th>
                <th className="px-6 py-3">SLA Deadline</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {shipments?.map((s) => (
                <tr key={s.shipment_id} onClick={() => onSelect(s)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-blue-600">{s.shipment_id}</td>
                  <td className="px-6 py-4 text-slate-700">{s.origin} → {s.destination}</td>
                  <td className="px-6 py-4 text-slate-500">{s.carrier}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {new Date(s.sla_deadline).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColor[s.status]}`}>
                      {s.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleAnalyze(e, s)}
                        disabled={analyzingId === s.shipment_id}
                        className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg disabled:opacity-50 transition-colors"
                      >
                        {analyzingId === s.shipment_id ? (
                          <><span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> Analyzing...</>
                        ) : (
                          <><Brain size={12} /> Analyze</>
                        )}
                      </button>
                      {isAdmin && (
                        <button onClick={(e) => handleDelete(e, s.shipment_id)}
                          className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {(!shipments || shipments.length === 0) && (
            <div className="text-center py-12 text-slate-400">
              <Package size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No shipments yet. Add one to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Auto-open detail modal with prefetched analysis */}
      {detailShipment && (
        <ShipmentDetail
          shipment={detailShipment}
          prefetchedAnalysis={prefetchedAnalysis}
          onClose={() => {
            setDetailShipment(null)
            setPrefetchedAnalysis(null)
          }}
        />
      )}
    </>
  )
}