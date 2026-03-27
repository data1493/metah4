export interface SearchResult {
  title: string
  description: string
  url: string
  hash: string
  domain: string
  isLocal: boolean
}

export interface BraveWebResult {
  title: string
  description?: string
  url: string
}

export interface BraveLocalResult {
  title: string
  description?: string
  url: string
  address?: string
  phone?: string
}

export interface BraveImageResult {
  title: string
  url: string
  source: string
  thumbnail: { src: string; width?: number; height?: number }
  properties?: { url?: string; width?: number; height?: number }
}

export interface BraveVideoResult {
  title: string
  url: string
  description?: string
  age?: string
  thumbnail?: { src: string }
  meta_url?: { netloc?: string }
}

export interface BraveNewsResult {
  title: string
  url: string
  description?: string
  age?: string
  thumbnail?: { src: string }
  meta_url?: { netloc?: string }
  source?: { name?: string }
}

export interface LogEntry {
  timestamp: Date
  message: string
}

export interface NominatimResult {
  place_id: number
  lat: string
  lon: string
  display_name: string
  name: string
  type: string
  class: string
  address?: {
    road?: string
    suburb?: string
    city?: string
    state?: string
    postcode?: string
    country?: string
  }
}

export type SearchTab = 'all' | 'images' | 'videos' | 'news' | 'maps'
