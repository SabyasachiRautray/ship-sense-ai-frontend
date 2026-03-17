import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'


import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const CITY_COORDS = {
  Mumbai:    [19.0760, 72.8777],
  Delhi:     [28.7041, 77.1025],
  Bangalore: [12.9716, 77.5946],
  Chennai:   [13.0827, 80.2707],
  Kolkata:   [22.5726, 88.3639],
  Pune:      [18.5204, 73.8567],
  Hyderabad: [17.3850, 78.4867],
  Ahmedabad: [23.0225, 72.5714],
  Jaipur:    [26.9124, 75.7873],
  Surat:     [21.1702, 72.8311],
}

// Green marker for origin
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
})

// Red marker for destination
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
})

// Orange marker for alternate route midpoint
const orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
})

// Auto fit bounds
function FitBounds({ positions }) {
  const map = useMap()
  useEffect(() => {
    if (positions.length >= 2) {
      map.fitBounds(positions, { padding: [40, 40] })
    }
  }, [positions])
  return null
}

export default function ShipmentMap({ origin, destination, riskLevel, recommendation }) {
  const originCoords      = CITY_COORDS[origin]
  const destinationCoords = CITY_COORDS[destination]

  if (!originCoords || !destinationCoords) {
    return (
      <div className="h-64 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-sm">
        Map not available for this route
      </div>
    )
  }

  const isHighRisk     = riskLevel === 'High'
  const showAltRoute   = isHighRisk && recommendation === 'reroute shipment'

  // Main route — red if high risk, blue if ok
  const routeColor     = isHighRisk ? '#ef4444' : '#3b82f6'

  // Alternate route — slight curve via midpoint offset
  const midLat   = (originCoords[0] + destinationCoords[0]) / 2 + 1.5
  const midLng   = (originCoords[1] + destinationCoords[1]) / 2 - 1.5
  const altRoute = [originCoords, [midLat, midLng], destinationCoords]

  const allPositions = [originCoords, destinationCoords]

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <MapContainer
        center={originCoords}
        zoom={5}
        style={{ height: '300px', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds positions={allPositions} />

        {/* Main route line */}
        <Polyline
          positions={[originCoords, destinationCoords]}
          color={routeColor}
          weight={3}
          dashArray={isHighRisk ? '8 4' : undefined}
        />

        {/* Alternate route if rerouting recommended */}
        {showAltRoute && (
          <>
            <Polyline
              positions={altRoute}
              color="#22c55e"
              weight={3}
              dashArray="6 3"
            />
            <Marker position={[midLat, midLng]} icon={orangeIcon}>
              <Popup>
                <div className="text-xs">
                  <strong>Recommended Alternate Route</strong>
                  <br />Avoids high-risk corridor
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Origin marker */}
        <Marker position={originCoords} icon={greenIcon}>
          <Popup>
            <div className="text-xs font-semibold">
              📦 Origin: {origin}
            </div>
          </Popup>
        </Marker>

        {/* Destination marker */}
        <Marker position={destinationCoords} icon={redIcon}>
          <Popup>
            <div className="text-xs font-semibold">
              🏁 Destination: {destination}
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Map legend */}
      <div className="bg-white px-4 py-2 flex items-center gap-4 flex-wrap text-xs text-slate-500 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 rounded" style={{ backgroundColor: routeColor }} />
          <span>Current Route {isHighRisk ? '(At Risk)' : '(On Track)'}</span>
        </div>
        {showAltRoute && (
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 bg-green-500 rounded" />
            <span>Recommended Alternate Route</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="text-green-600">●</span> Origin
          <span className="text-red-500 ml-1">●</span> Destination
        </div>
      </div>
    </div>
  )
}