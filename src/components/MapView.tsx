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

// Syncs map view to GPS position whenever coords change.
// MapContainer ignores `center` prop changes after mount, so this is required.
function GpsCenter({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lon], 13, { animate: true })
  }, [lat, lon, map])
  return null
}

interface MapViewProps {
  results: NominatimResult[]
  hasSearched: boolean
  userLat: number | null
  userLon: number | null
}

const MapView = memo(function MapView({ results: rawResults, hasSearched, userLat, userLon }: MapViewProps) {
  const results = Array.isArray(rawResults) ? rawResults : []
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

  useEffect(() => { setSelectedIdx(null) }, [results.length])

  const hasGps = userLat !== null && userLon !== null

  // No results and no GPS — show blank state
  if (results.length === 0 && !hasGps) {
    return (
      <div className="text-center py-8 text-zinc-500 text-sm">
        {hasSearched ? 'No places found. Try a more specific search.' : 'Search to see map results.'}
      </div>
    )
  }

  // Center: GPS position takes priority over first result
  const center: [number, number] = hasGps
    ? [userLat!, userLon!]
    : [parseFloat(results[0].lat), parseFloat(results[0].lon)]

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
      {results.length === 0 && hasGps && hasSearched && (
        <p className="text-zinc-500 text-sm text-center lg:hidden">No places found nearby. Map shows your location.</p>
      )}

      {/* Map */}
      <div className="w-full lg:flex-1 h-72 lg:h-[500px] rounded overflow-hidden border border-zinc-800">
        <MapContainer
          center={center}
          zoom={hasGps ? 13 : 12}
          style={{ height: '100%', width: '100%', background: '#111' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={19}
          />

          {/* Keep map centered on GPS when no pin is selected */}
          {hasGps && selectedIdx === null && (
            <GpsCenter lat={userLat!} lon={userLon!} />
          )}

          {/* Fly to selected result pin */}
          {selectedIdx !== null && (
            <FlyTo
              lat={parseFloat(results[selectedIdx].lat)}
              lon={parseFloat(results[selectedIdx].lon)}
            />
          )}

          {/* "You are here" marker */}
          {hasGps && (
            <CircleMarker
              center={[userLat!, userLon!]}
              radius={8}
              pathOptions={{ color: '#d400ff', fillColor: '#d400ff', fillOpacity: 0.85, weight: 2 }}
            >
              <Popup>You are here</Popup>
            </CircleMarker>
          )}

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
      {results.length > 0 && (
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
      )}

      {results.length === 0 && hasGps && hasSearched && (
        <p className="text-zinc-500 text-sm text-center hidden lg:block self-center">No places found nearby.<br />Map shows your location.</p>
      )}
    </div>
  )
})

export default MapView
