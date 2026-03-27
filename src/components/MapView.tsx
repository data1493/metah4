import { memo, useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet'
import type { NominatimResult } from '../types'
import MapResultCard from './MapResultCard'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default marker icons broken by vite bundling
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const selectedIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: 'selected-marker',
})

function FlyTo({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo([lat, lon], 14, { duration: 0.8 })
  }, [lat, lon, map])
  return null
}

interface MapViewProps {
  results: NominatimResult[]
  hasSearched: boolean
  userLat: number | null
  userLon: number | null
  locationEnabled: boolean
}

const MapView = memo(function MapView({ results: rawResults, hasSearched, userLat, userLon, locationEnabled }: MapViewProps) {
  const results = Array.isArray(rawResults) ? rawResults : []
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

  useEffect(() => { setSelectedIdx(null) }, [results.length])

  const hasGps = userLat !== null && userLon !== null

  // Location not enabled — prompt the user instead of showing a wrong map
  if (!locationEnabled) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-zinc-500 text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-zinc-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
        <p>Enable <span className="text-neon-purple font-medium">Local Results</span> to use Maps</p>
      </div>
    )
  }

  // Location enabled but coords not yet resolved — show spinner
  if (!hasGps) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 rounded-full border-2 border-neon-purple border-t-transparent animate-spin" aria-label="Locating…" />
      </div>
    )
  }

  // Key on coords so MapContainer remounts with the correct initial center
  // when coordinates first arrive — avoids the setView race condition
  const mapKey = `${userLat.toFixed(3)}-${userLon.toFixed(3)}`

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
      {/* Map */}
      <div className="w-full lg:flex-1 h-72 lg:h-[500px] rounded overflow-hidden border border-zinc-800">
        <MapContainer
          key={mapKey}
          center={[userLat, userLon]}
          zoom={13}
          style={{ height: '100%', width: '100%', background: '#111' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={19}
          />

          {/* Fly to selected result pin */}
          {selectedIdx !== null && (
            <FlyTo
              lat={parseFloat(results[selectedIdx].lat)}
              lon={parseFloat(results[selectedIdx].lon)}
            />
          )}

          {/* "You are here" marker */}
          <CircleMarker
            center={[userLat, userLon]}
            radius={8}
            pathOptions={{ color: '#d400ff', fillColor: '#d400ff', fillOpacity: 0.85, weight: 2 }}
          >
            <Popup>You are here</Popup>
          </CircleMarker>

          {/* Result pins */}
          {results.map((r, i) => (
            <Marker
              key={r.place_id}
              position={[parseFloat(r.lat), parseFloat(r.lon)]}
              icon={i === selectedIdx ? selectedIcon : new L.Icon.Default()}
              eventHandlers={{ click: () => setSelectedIdx(i) }}
            >
              <Popup>
                <div style={{ minWidth: 160 }}>
                  <strong>{r.name || r.display_name.split(',')[0]}</strong>
                  <br />
                  <span style={{ fontSize: 11, color: '#888' }}>{r.type}</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Result list */}
      {results.length > 0 ? (
        <div className="lg:w-72 flex flex-col gap-2 overflow-y-auto max-h-72 lg:max-h-[500px] pr-1">
          {results.map((r, i) => (
            <MapResultCard
              key={r.place_id}
              result={r}
              index={i}
              isSelected={i === selectedIdx}
              onSelect={() => setSelectedIdx(i === selectedIdx ? null : i)}
            />
          ))}
        </div>
      ) : hasSearched ? (
        <p className="text-zinc-500 text-xs self-center text-center lg:w-48">
          No places found nearby.<br />Map shows your location.
        </p>
      ) : null}
    </div>
  )
})

export default MapView
