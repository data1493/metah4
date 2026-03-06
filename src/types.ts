export interface SearchResult {
  title: string
  description: string
  url: string
  hash: string
}

export interface BraveWebResult {
  title: string
  description?: string
  url: string
}

export interface LogEntry {
  timestamp: Date
  message: string
}
