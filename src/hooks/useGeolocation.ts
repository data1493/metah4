import { useState, useEffect, useCallback } from 'react'

interface GeolocationState {
  lat: number | null
  lng: number | null
  error: string | null
  loading: boolean
  requested: boolean
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    error: null,
    loading: false,
    requested: false,
  })

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: 'Geolocation not supported', requested: true }))
      return
    }

    setState(prev => ({ ...prev, loading: true, requested: true }))

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          error: null,
          loading: false,
          requested: true,
        })
      },
      (err) => {
        setState(prev => ({
          ...prev,
          error: err.message,
          loading: false,
        }))
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    )
  }, [])

  // Auto-request on mount (one-time)
  useEffect(() => {
    if (!state.requested) {
      requestLocation()
    }
  }, [state.requested, requestLocation])

  return {
    lat: state.lat,
    lng: state.lng,
    error: state.error,
    loading: state.loading,
    hasLocation: state.lat !== null && state.lng !== null,
    requestLocation,
  }
}
