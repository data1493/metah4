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

export interface LogEntry {
  timestamp: Date
  message: string
}

export type SearchTab = 'all' | 'images' | 'videos' | 'news'
