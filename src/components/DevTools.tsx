import { useState, useRef, useCallback } from 'react'

/* ── Utility helpers ─────────────────────────────────────── */

type ThemeColors = Record<string, string>

const DEFAULTS: ThemeColors = {
  'neon-green': '#FDB927',
  'neon-purple': '#542583',
  'neon-gold': '#FDB927',
  'deep-black': '#1a0a1a',
  'card-bg': '#111111',
}

const LABELS: Record<string, string> = {
  'neon-green': 'Neon Green',
  'neon-purple': 'Neon Purple',
  'neon-gold': 'Neon Gold',
  'deep-black': 'Deep Black',
  'card-bg': 'Card BG',
}

function rgbToHex(rgb: string): string {
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!m) return '#000000'
  return '#' + [m[1], m[2], m[3]].map(x => parseInt(x).toString(16).padStart(2, '0')).join('')
}

function describeElement(el: HTMLElement): string {
  const tag = el.tagName.toLowerCase()
  if (el.id) return `${tag}#${el.id}`
  const cls = el.className && typeof el.className === 'string'
    ? '.' + el.className.split(/\s+/).slice(0, 2).join('.')
    : ''
  const text = el.textContent?.trim().slice(0, 20)
  return text ? `${tag}${cls} "${text}"` : `${tag}${cls}`
}

/* ── DevColorPicker ──────────────────────────────────────── */

interface PickerHistoryEntry {
  element: HTMLElement
  property: string
  oldValue: string
  newValue: string
}

export function DevColorPicker() {
  const [open, setOpen] = useState(false)
  const [picking, setPicking] = useState(false)
  const [pickedEl, setPickedEl] = useState<HTMLElement | null>(null)
  const [pickedColor, setPickedColor] = useState('#000000')
  const [pickedProperty, setPickedProperty] = useState<'backgroundColor' | 'color' | 'borderColor'>('backgroundColor')
  const [pickedLabel, setPickedLabel] = useState('')
  const hoverRef = useRef<HTMLElement | null>(null)
  const [elHistory, setElHistory] = useState<PickerHistoryEntry[]>([])
  const [elHistoryIdx, setElHistoryIdx] = useState(-1)

  const [colors, setColors] = useState<ThemeColors>({ ...DEFAULTS })
  const [themeHistory, setThemeHistory] = useState<ThemeColors[]>([{ ...DEFAULTS }])
  const [themeIdx, setThemeIdx] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const applyThemeColors = useCallback((c: ThemeColors) => {
    Object.entries(c).forEach(([k, v]) => {
      document.documentElement.style.setProperty(`--color-${k}`, v)
    })
  }, [])

  const handleThemeChange = (key: string, value: string) => {
    const next = { ...colors, [key]: value }
    setColors(next)
    applyThemeColors(next)
    const trimmed = themeHistory.slice(0, themeIdx + 1)
    trimmed.push(next)
    setThemeHistory(trimmed)
    setThemeIdx(trimmed.length - 1)
  }

  const themeBack = () => {
    if (themeIdx <= 0) return
    const prev = themeHistory[themeIdx - 1]
    setColors(prev)
    applyThemeColors(prev)
    setThemeIdx(themeIdx - 1)
  }

  const themeForward = () => {
    if (themeIdx >= themeHistory.length - 1) return
    const next = themeHistory[themeIdx + 1]
    setColors(next)
    applyThemeColors(next)
    setThemeIdx(themeIdx + 1)
  }

  const startPicking = () => { setPicking(true); setPickedEl(null) }

  const stopPicking = () => {
    setPicking(false)
    if (hoverRef.current) { hoverRef.current.style.outline = ''; hoverRef.current = null }
  }

  const handleOverlayMouseMove = useCallback((e: React.MouseEvent) => {
    const overlay = e.currentTarget as HTMLElement
    overlay.style.pointerEvents = 'none'
    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
    overlay.style.pointerEvents = 'auto'
    if (!el || el.closest('[data-picker-panel]')) return
    if (hoverRef.current && hoverRef.current !== el) hoverRef.current.style.outline = ''
    el.style.outline = '2px solid #22c55e'
    hoverRef.current = el
  }, [])

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    const overlay = e.currentTarget as HTMLElement
    overlay.style.pointerEvents = 'none'
    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
    overlay.style.pointerEvents = 'auto'
    if (!el || el.closest('[data-picker-panel]')) return
    if (hoverRef.current) { hoverRef.current.style.outline = ''; hoverRef.current = null }
    el.style.outline = '3px solid #FDB927'
    const computed = window.getComputedStyle(el)
    setPickedEl(el)
    setPickedColor(rgbToHex(computed.backgroundColor))
    setPickedProperty('backgroundColor')
    setPickedLabel(describeElement(el))
    setPicking(false)
  }, [])

  const handlePickedColorChange = (value: string) => {
    if (!pickedEl) return
    const old = pickedEl.style[pickedProperty] || window.getComputedStyle(pickedEl)[pickedProperty]
    pickedEl.style[pickedProperty] = value
    setPickedColor(value)
    const entry: PickerHistoryEntry = { element: pickedEl, property: pickedProperty, oldValue: old, newValue: value }
    const trimmed = elHistory.slice(0, elHistoryIdx + 1)
    trimmed.push(entry)
    setElHistory(trimmed)
    setElHistoryIdx(trimmed.length - 1)
  }

  const handlePropertyChange = (prop: 'backgroundColor' | 'color' | 'borderColor') => {
    if (!pickedEl) return
    setPickedProperty(prop)
    setPickedColor(rgbToHex(window.getComputedStyle(pickedEl)[prop]))
  }

  const elBack = () => {
    if (elHistoryIdx < 0) return
    const entry = elHistory[elHistoryIdx]
    entry.element.style[entry.property as 'backgroundColor'] = entry.oldValue
    setElHistoryIdx(elHistoryIdx - 1)
    if (entry.element === pickedEl) setPickedColor(rgbToHex(entry.oldValue))
  }

  const elForward = () => {
    if (elHistoryIdx >= elHistory.length - 1) return
    const entry = elHistory[elHistoryIdx + 1]
    entry.element.style[entry.property as 'backgroundColor'] = entry.newValue
    setElHistoryIdx(elHistoryIdx + 1)
    if (entry.element === pickedEl) setPickedColor(rgbToHex(entry.newValue))
  }

  const deselectElement = () => {
    if (pickedEl) pickedEl.style.outline = ''
    setPickedEl(null); setPickedLabel('')
  }

  const handleSave = async () => {
    setSaving(true); setSaveMsg('')
    try {
      const output = `/* tailwind.config.js colors */\n${Object.entries(colors).map(([k, v]) => `'${k}': '${v}',`).join('\n')}\n\n/* index.css :root */\n${Object.entries(colors).map(([k, v]) => `--${k}: ${v};`).join('\n')}\n\n/* index.css @theme */\n${Object.entries(colors).map(([k, v]) => `--color-${k}: ${v};`).join('\n')}`
      await navigator.clipboard.writeText(output)
      setSaveMsg('Copied to clipboard!')
    } catch {
      const output = Object.entries(colors).map(([k, v]) => `--color-${k}: ${v};`).join('\n')
      setSaveMsg(`Copy manually:\n${output}`)
    } finally {
      setSaving(false)
      setTimeout(() => setSaveMsg(''), 5000)
    }
  }

  const [tab, setTab] = useState<'theme' | 'element'>('element')

  return (
    <>
      {picking && (
        <div onMouseMove={handleOverlayMouseMove} onClick={handleOverlayClick} className="fixed inset-0 z-[55]" style={{ cursor: 'crosshair', backgroundColor: 'rgba(0,0,0,0.15)' }}>
          <div className="fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-xs font-bold tracking-wide" style={{ backgroundColor: '#111', border: '1px solid #FDB927', color: '#FDB927' }}>
            Click any element to select it &nbsp;·&nbsp;
            <button onClick={(e) => { e.stopPropagation(); stopPicking() }} className="underline" style={{ color: '#ef4444' }}>Cancel</button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} data-picker-panel className="fixed bottom-20 right-4 z-[60] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110" style={{ backgroundColor: '#111111', border: '1px solid #FDB927', color: '#FDB927' }} title="Dev Color Picker">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
      </button>
      {open && (
        <div data-picker-panel className="fixed bottom-32 right-4 z-[60] w-80 max-sm:left-4 max-sm:right-4 max-sm:w-auto max-sm:bottom-20 rounded-lg shadow-2xl" style={{ backgroundColor: '#111111', border: '1px solid #FDB927' }}>
          <div className="flex" style={{ borderBottom: '1px solid rgba(253,185,39,0.3)' }}>
            <button onClick={() => setTab('element')} className="flex-1 px-4 py-2.5 text-xs font-bold tracking-wide transition-colors" style={{ color: tab === 'element' ? '#FDB927' : 'rgba(255,255,255,0.3)', borderBottom: tab === 'element' ? '2px solid #FDB927' : '2px solid transparent' }}>🎯 Pick Element</button>
            <button onClick={() => setTab('theme')} className="flex-1 px-4 py-2.5 text-xs font-bold tracking-wide transition-colors" style={{ color: tab === 'theme' ? '#FDB927' : 'rgba(255,255,255,0.3)', borderBottom: tab === 'theme' ? '2px solid #FDB927' : '2px solid transparent' }}>🎨 Theme Colors</button>
            <button onClick={() => { stopPicking(); deselectElement(); setOpen(false) }} style={{ color: '#542583' }} className="px-3 text-lg leading-none hover:opacity-70">✕</button>
          </div>
          {tab === 'element' && (
            <div className="px-4 py-3 space-y-3">
              <button onClick={startPicking} className="w-full px-3 py-2 rounded text-xs font-bold transition-all" style={{ backgroundColor: picking ? '#22c55e' : 'rgba(253,185,39,0.15)', color: picking ? '#000' : '#FDB927', border: '1px solid ' + (picking ? '#22c55e' : 'rgba(253,185,39,0.4)') }}>{picking ? '⏳ Click an element on the page...' : '🎯 Start Picking'}</button>
              {pickedEl && (
                <>
                  <div className="rounded p-2" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}><div className="text-[10px] font-mono truncate" style={{ color: '#FDB927' }}>{pickedLabel}</div></div>
                  <div className="flex gap-1">
                    {(['backgroundColor', 'color', 'borderColor'] as const).map((p) => (
                      <button key={p} onClick={() => handlePropertyChange(p)} className="flex-1 px-2 py-1 rounded text-[10px] font-bold transition-colors" style={{ backgroundColor: pickedProperty === p ? '#FDB927' : 'rgba(255,255,255,0.05)', color: pickedProperty === p ? '#000' : 'rgba(255,255,255,0.5)' }}>{p === 'backgroundColor' ? 'BG' : p === 'color' ? 'Text' : 'Border'}</button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="color" value={pickedColor} onChange={(e) => handlePickedColorChange(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-none bg-transparent" />
                    <div className="flex-1"><div className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.6)' }}>{pickedColor}</div></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={elBack} disabled={elHistoryIdx < 0} className="px-2 py-1 rounded text-xs font-bold disabled:opacity-30" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#FDB927' }}>← Back</button>
                    <button onClick={elForward} disabled={elHistoryIdx >= elHistory.length - 1} className="px-2 py-1 rounded text-xs font-bold disabled:opacity-30" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#FDB927' }}>Fwd →</button>
                    <div className="flex-1" />
                    <button onClick={deselectElement} className="px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>Deselect</button>
                  </div>
                </>
              )}
              {!pickedEl && !picking && <div className="text-[11px] text-center py-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Click "Start Picking" then click any element on the page</div>}
            </div>
          )}
          {tab === 'theme' && (
            <>
              <div className="px-4 py-3 space-y-3">
                {Object.keys(DEFAULTS).map((key) => (
                  <div key={key} className="flex items-center gap-3">
                    <input type="color" value={colors[key]} onChange={(e) => handleThemeChange(key, e.target.value)} className="w-8 h-8 rounded cursor-pointer border-none bg-transparent" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium" style={{ color: '#FDB927' }}>{LABELS[key]}</div>
                      <div className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>{colors[key]}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid rgba(253,185,39,0.3)' }}>
                <div className="flex gap-2">
                  <button onClick={themeBack} disabled={themeIdx <= 0} className="px-2 py-1 rounded text-xs font-bold disabled:opacity-30" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#FDB927' }}>← Back</button>
                  <button onClick={themeForward} disabled={themeIdx >= themeHistory.length - 1} className="px-2 py-1 rounded text-xs font-bold disabled:opacity-30" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#FDB927' }}>Fwd →</button>
                </div>
                <button onClick={handleSave} disabled={saving} className="px-3 py-1 rounded text-xs font-bold disabled:opacity-50" style={{ backgroundColor: '#22c55e', color: '#000' }}>{saving ? '...' : 'Save'}</button>
              </div>
              {saveMsg && <div className="px-4 pb-3"><div className="text-[10px] font-mono rounded p-2" style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>{saveMsg}</div></div>}
            </>
          )}
        </div>
      )}
    </>
  )
}

/* ── DevFontWorkshop ─────────────────────────────────────── */

const GOOGLE_FONTS = [
  'Rubik', 'JetBrains Mono', 'Inter', 'Poppins', 'Montserrat', 'Oswald',
  'Playfair Display', 'Raleway', 'Bebas Neue', 'Space Grotesk', 'Orbitron',
  'Fira Code', 'IBM Plex Mono', 'Source Code Pro', 'Archivo Black',
  'Barlow Condensed', 'DM Sans', 'Sora', 'Outfit', 'Lexend',
]

const FONT_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900]

interface FontHistoryEntry {
  elements: HTMLElement[]
  property: string
  oldValues: string[]
  newValue: string
}

function getSiblingSelector(el: HTMLElement): string {
  const tag = el.tagName.toLowerCase()
  const cls = typeof el.className === 'string' ? el.className.trim() : ''
  return `${tag}::${cls}`
}

function findLikeElements(el: HTMLElement): HTMLElement[] {
  const tag = el.tagName.toLowerCase()
  const cls = typeof el.className === 'string' ? el.className.trim() : ''
  if (!cls) return [el]
  const all = document.querySelectorAll<HTMLElement>(tag)
  const matches: HTMLElement[] = []
  for (const candidate of all) {
    const cCls = typeof candidate.className === 'string' ? candidate.className.trim() : ''
    if (cCls === cls) matches.push(candidate)
  }
  return matches.length > 0 ? matches : [el]
}

export function DevFontWorkshop() {
  const [open, setOpen] = useState(false)
  const [picking, setPicking] = useState(false)
  const [pickedEl, setPickedEl] = useState<HTMLElement | null>(null)
  const [pickedGroup, setPickedGroup] = useState<HTMLElement[]>([])
  const [pickedLabel, setPickedLabel] = useState('')
  const hoverRef = useRef<HTMLElement | null>(null)
  const hoverGroupRef = useRef<HTMLElement[]>([])
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set(['Rubik', 'JetBrains Mono']))

  const [fontFamily, setFontFamily] = useState('')
  const [fontSize, setFontSize] = useState('')
  const [fontWeight, setFontWeight] = useState('')
  const [letterSpacing, setLetterSpacing] = useState('')
  const [lineHeight, setLineHeight] = useState('')
  const [textTransform, setTextTransform] = useState('')

  const [history, setHistory] = useState<FontHistoryEntry[]>([])
  const [histIdx, setHistIdx] = useState(-1)

  const loadGoogleFont = useCallback((family: string) => {
    if (loadedFonts.has(family)) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/\s+/g, '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap`
    document.head.appendChild(link)
    setLoadedFonts(prev => new Set(prev).add(family))
  }, [loadedFonts])

  const readStyles = useCallback((el: HTMLElement) => {
    const cs = window.getComputedStyle(el)
    setFontFamily(cs.fontFamily.split(',')[0].replace(/['"]/g, '').trim())
    setFontSize(cs.fontSize)
    setFontWeight(cs.fontWeight)
    setLetterSpacing(cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing)
    setLineHeight(cs.lineHeight)
    setTextTransform(cs.textTransform)
  }, [])

  const pushHistory = useCallback((elements: HTMLElement[], prop: string, oldVals: string[], newVal: string) => {
    const entry: FontHistoryEntry = { elements, property: prop, oldValues: oldVals, newValue: newVal }
    const trimmed = history.slice(0, histIdx + 1)
    trimmed.push(entry)
    setHistory(trimmed)
    setHistIdx(trimmed.length - 1)
  }, [history, histIdx])

  const applyStyle = (prop: string, value: string) => {
    if (pickedGroup.length === 0) return
    const oldVals = pickedGroup.map(el => el.style.getPropertyValue(prop) || window.getComputedStyle(el).getPropertyValue(prop))
    pickedGroup.forEach(el => { ;(el.style as unknown as Record<string, string>)[prop] = value })
    pushHistory(pickedGroup, prop, oldVals, value)
  }

  const handleFontFamilyChange = (f: string) => { loadGoogleFont(f); setFontFamily(f); applyStyle('fontFamily', `'${f}', sans-serif`) }
  const handleFontSizeChange = (v: string) => { setFontSize(v); applyStyle('fontSize', v) }
  const handleFontWeightChange = (w: string) => { setFontWeight(w); applyStyle('fontWeight', w) }
  const handleLetterSpacingChange = (v: string) => { setLetterSpacing(v); applyStyle('letterSpacing', v) }
  const handleLineHeightChange = (v: string) => { setLineHeight(v); applyStyle('lineHeight', v) }
  const handleTextTransformChange = (v: string) => { setTextTransform(v); applyStyle('textTransform', v) }

  const goBack = () => {
    if (histIdx < 0) return
    const e = history[histIdx]
    e.elements.forEach((el, i) => { ;(el.style as unknown as Record<string, string>)[e.property] = e.oldValues[i] })
    setHistIdx(histIdx - 1)
    if (pickedEl) readStyles(pickedEl)
  }

  const goForward = () => {
    if (histIdx >= history.length - 1) return
    const e = history[histIdx + 1]
    e.elements.forEach(el => { ;(el.style as unknown as Record<string, string>)[e.property] = e.newValue })
    setHistIdx(histIdx + 1)
    if (pickedEl) readStyles(pickedEl)
  }

  const startPicking = () => { setPicking(true); setPickedEl(null) }
  const stopPicking = () => { setPicking(false); if (hoverRef.current) { hoverRef.current.style.outline = ''; hoverRef.current = null } }
  const deselectElement = () => {
    if (pickedEl) pickedEl.style.outline = ''
    pickedGroup.forEach(el => { el.style.outline = '' })
    setPickedEl(null); setPickedGroup([]); setPickedLabel('')
  }

  const handleOverlayMouseMove = useCallback((e: React.MouseEvent) => {
    const overlay = e.currentTarget as HTMLElement
    overlay.style.pointerEvents = 'none'
    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
    overlay.style.pointerEvents = 'auto'
    if (!el || el.closest('[data-font-panel]')) return
    hoverGroupRef.current.forEach(h => { h.style.outline = '' })
    if (hoverRef.current && hoverRef.current !== el) hoverRef.current.style.outline = ''
    const group = findLikeElements(el)
    group.forEach(g => { g.style.outline = '2px dashed #d400ff' })
    hoverGroupRef.current = group
    hoverRef.current = el
  }, [])

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    const overlay = e.currentTarget as HTMLElement
    overlay.style.pointerEvents = 'none'
    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
    overlay.style.pointerEvents = 'auto'
    if (!el || el.closest('[data-font-panel]')) return
    hoverGroupRef.current.forEach(h => { h.style.outline = '' })
    if (hoverRef.current) { hoverRef.current.style.outline = ''; hoverRef.current = null }
    hoverGroupRef.current = []
    const group = findLikeElements(el)
    group.forEach(g => { g.style.outline = '3px solid #d400ff' })
    setPickedEl(el); setPickedGroup(group)
    setPickedLabel(`${describeElement(el)} (${group.length} matching)`)
    readStyles(el); setPicking(false)
  }, [readStyles])

  const handleSave = async () => {
    const seen = new Set<string>()
    const lines: string[] = []
    for (const h of history.slice(0, histIdx + 1)) {
      const key = `${getSiblingSelector(h.elements[0])}::${h.property}`
      if (!seen.has(key)) { seen.add(key); lines.push(`${describeElement(h.elements[0])} (×${h.elements.length}) → ${h.property}: ${h.newValue}`) }
    }
    const output = `/* Font Workshop Changes */\n${lines.join('\n')}`
    try { await navigator.clipboard.writeText(output) } catch { /* ignore */ }
    alert(`Font changes copied to clipboard!\n\n${output}`)
  }

  return (
    <>
      {picking && (
        <div onMouseMove={handleOverlayMouseMove} onClick={handleOverlayClick} className="fixed inset-0 z-[55]" style={{ cursor: 'crosshair', backgroundColor: 'rgba(212,0,255,0.08)' }}>
          <div className="fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-xs font-bold tracking-wide" style={{ backgroundColor: '#111', border: '1px solid #d400ff', color: '#d400ff' }}>
            Click any text element &nbsp;·&nbsp;
            <button onClick={(e) => { e.stopPropagation(); stopPicking() }} className="underline" style={{ color: '#ef4444' }}>Cancel</button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} data-font-panel className="fixed bottom-20 left-4 z-[60] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110" style={{ backgroundColor: '#111111', border: '1px solid #d400ff', color: '#d400ff' }} title="Dev Font Workshop">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" /></svg>
      </button>
      {open && (
        <div data-font-panel className="fixed bottom-32 left-4 z-[60] w-80 max-sm:left-4 max-sm:right-4 max-sm:w-auto max-sm:bottom-20 rounded-lg shadow-2xl" style={{ backgroundColor: '#111111', border: '1px solid #d400ff' }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(212,0,255,0.3)' }}>
            <span className="text-sm font-bold tracking-wide" style={{ color: '#d400ff' }}>✏️ Font Workshop</span>
            <button onClick={() => { stopPicking(); deselectElement(); setOpen(false) }} style={{ color: '#542583' }} className="text-lg leading-none hover:opacity-70">✕</button>
          </div>
          <div className="px-4 py-3 space-y-3">
            <button onClick={startPicking} className="w-full px-3 py-2 rounded text-xs font-bold transition-all" style={{ backgroundColor: picking ? '#d400ff' : 'rgba(212,0,255,0.15)', color: picking ? '#000' : '#d400ff', border: '1px solid ' + (picking ? '#d400ff' : 'rgba(212,0,255,0.4)') }}>{picking ? '⏳ Click an element...' : '🎯 Pick Element'}</button>
            {pickedEl ? (
              <>
                <div className="rounded p-2" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}><div className="text-[10px] font-mono truncate" style={{ color: '#d400ff' }}>{pickedLabel}</div></div>
                <div>
                  <label className="text-[10px] font-bold block mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Font Family</label>
                  <select value={fontFamily} onChange={(e) => handleFontFamilyChange(e.target.value)} className="w-full px-2 py-1.5 rounded text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(212,0,255,0.3)' }}>
                    {GOOGLE_FONTS.map(f => <option key={f} value={f} style={{ backgroundColor: '#111' }}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold block mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Font Size <span style={{ color: '#d400ff' }}>{fontSize}</span></label>
                  <input type="range" min="8" max="96" step="1" value={parseInt(fontSize) || 16} onChange={(e) => handleFontSizeChange(e.target.value + 'px')} className="w-full accent-purple-500" />
                </div>
                <div>
                  <label className="text-[10px] font-bold block mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Weight <span style={{ color: '#d400ff' }}>{fontWeight}</span></label>
                  <div className="flex flex-wrap gap-1">
                    {FONT_WEIGHTS.map(w => <button key={w} onClick={() => handleFontWeightChange(String(w))} className="px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors" style={{ backgroundColor: String(w) === fontWeight ? '#d400ff' : 'rgba(255,255,255,0.05)', color: String(w) === fontWeight ? '#000' : 'rgba(255,255,255,0.4)' }}>{w}</button>)}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold block mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Letter Spacing <span style={{ color: '#d400ff' }}>{letterSpacing}</span></label>
                  <input type="range" min="-5" max="20" step="0.5" value={parseFloat(letterSpacing) || 0} onChange={(e) => handleLetterSpacingChange(e.target.value + 'px')} className="w-full accent-purple-500" />
                </div>
                <div>
                  <label className="text-[10px] font-bold block mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Line Height <span style={{ color: '#d400ff' }}>{lineHeight}</span></label>
                  <input type="range" min="0.8" max="3" step="0.1" value={parseFloat(lineHeight) / (parseInt(fontSize) || 16) || 1.5} onChange={(e) => handleLineHeightChange(e.target.value)} className="w-full accent-purple-500" />
                </div>
                <div>
                  <label className="text-[10px] font-bold block mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Transform</label>
                  <div className="flex gap-1">
                    {['none', 'uppercase', 'lowercase', 'capitalize'].map(t => <button key={t} onClick={() => handleTextTransformChange(t)} className="flex-1 px-1 py-1 rounded text-[10px] font-bold transition-colors" style={{ backgroundColor: textTransform === t ? '#d400ff' : 'rgba(255,255,255,0.05)', color: textTransform === t ? '#000' : 'rgba(255,255,255,0.4)' }}>{t === 'none' ? 'Aa' : t === 'uppercase' ? 'AA' : t === 'lowercase' ? 'aa' : 'Ab'}</button>)}
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button onClick={goBack} disabled={histIdx < 0} className="px-2 py-1 rounded text-xs font-bold disabled:opacity-30" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#d400ff' }}>← Back</button>
                  <button onClick={goForward} disabled={histIdx >= history.length - 1} className="px-2 py-1 rounded text-xs font-bold disabled:opacity-30" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#d400ff' }}>Fwd →</button>
                  <div className="flex-1" />
                  <button onClick={handleSave} className="px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: '#22c55e', color: '#000' }}>Save</button>
                  <button onClick={deselectElement} className="px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>✕</button>
                </div>
              </>
            ) : !picking ? (
              <div className="text-[11px] text-center py-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Pick an element to adjust its typography</div>
            ) : null}
          </div>
        </div>
      )}
    </>
  )
}
