import { memo, useCallback, useRef } from 'react'
import type { SearchTab } from '../types'

interface SearchTabsProps {
  activeTab: SearchTab
  onTabChange: (tab: SearchTab) => void
}

const TABS: { id: SearchTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'images', label: 'Images' },
  { id: 'videos', label: 'Videos' },
  { id: 'news', label: 'News' },
]

const SearchTabs = memo(function SearchTabs({ activeTab, onTabChange }: SearchTabsProps) {
  const tabsRef = useRef<HTMLUListElement>(null)

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const currentIdx = TABS.findIndex(t => t.id === activeTab)
    let nextIdx = currentIdx

    if (e.key === 'ArrowRight') {
      nextIdx = (currentIdx + 1) % TABS.length
    } else if (e.key === 'ArrowLeft') {
      nextIdx = (currentIdx - 1 + TABS.length) % TABS.length
    } else {
      return
    }

    e.preventDefault()
    onTabChange(TABS[nextIdx].id)
    // Focus the next tab button
    const buttons = tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    buttons?.[nextIdx]?.focus()
  }, [activeTab, onTabChange])

  return (
    <nav aria-label="Search categories" className="border-b border-neon-purple/15 overflow-x-auto">
      <div className="max-w-5xl mx-auto px-4">
        <ul className="flex gap-6" role="tablist" ref={tabsRef} onKeyDown={handleKeyDown}>
          {TABS.map(({ id, label }) => {
            const isActive = activeTab === id
            return (
              <li key={id} role="presentation">
                <button
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => onTabChange(id)}
                  className={`relative py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-neon-purple'
                      : 'text-neon-gold/50 hover:text-neon-gold/80'
                  }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-purple rounded-full" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
})

export default SearchTabs
