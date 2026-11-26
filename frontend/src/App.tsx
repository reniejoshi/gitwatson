import { useEffect, useRef, useState } from 'react'

const SAMPLE_USERS = ['reniejoshi', 'aadiguy', 'rodlewis360', 'aaravgupta299']

function App() {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [hoveredChip, setHoveredChip] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const runSearch = (username: string) => {
    const trimmedUsername = username.trim()
    if (!trimmedUsername) return
    setQuery(trimmedUsername)
    console.log('Searching for:', trimmedUsername)
  }

  const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    runSearch(query)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#1f1e1c',
        backgroundImage: 'radial-gradient(#302f2c 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        color: '#e2f1f3',
        fontFamily: "'Fira Code', monospace",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '18vh 1.25rem 4rem',
        }}
      >
        <div style={{ width: '100%', maxWidth: '540px' }}>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              margin: '0 0 0.4rem 0',
              color: '#f4f7f8',
            }}
          >
            gitwatson
          </h1>
          <form onSubmit={handleSearch}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#161514',
                border: `1px solid ${isFocused ? '#1d6fa5' : '#383632'}`,
                boxShadow: isFocused ? '0 0 0 2px rgba(10, 63, 102, 0.35)' : 'none',
                borderRadius: '3px',
                padding: '0.65rem 0.85rem',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              <span
                style={{
                  color: '#6b6963',
                  marginRight: '0.5rem',
                  fontSize: '0.88rem',
                  userSelect: 'none',
                }}
              >
                ://github.com/
              </span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setQuery('')
                    inputRef.current?.blur()
                  }
                }}
                placeholder="username"
                aria-label="GitHub username"
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#e2f1f3',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  minWidth: 0,
                }}
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    inputRef.current?.focus()
                  }}
                  style={{
                    backgroundColor: '#242320',
                    border: '1px solid #3a3834',
                    borderRadius: '2px',
                    color: '#9a9890',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '0.75rem',
                    padding: '0.15rem 0.45rem',
                    marginLeft: '0.5rem',
                  }}
                >
                  esc
                </button>
              ) : (
                <kbd
                  style={{
                    backgroundColor: '#242320',
                    border: '1px solid #3a3834',
                    borderRadius: '2px',
                    color: '#787670',
                    fontFamily: 'inherit',
                    fontSize: '0.75rem',
                    padding: '0.15rem 0.45rem',
                    marginLeft: '0.5rem',
                  }}
                >
                  /
                </kbd>
              )}
            </div>
          </form>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.85rem',
              fontSize: '0.78rem',
            }}
          >
            <span style={{ color: '#6b6963' }}>try:</span>
            {SAMPLE_USERS.map((user) => {
              const isHovered = hoveredChip === user
              return (
                <button
                  key={user}
                  type="button"
                  onClick={() => runSearch(user)}
                  onMouseEnter={() => setHoveredChip(user)}
                  onMouseLeave={() => setHoveredChip(null)}
                  style={{
                    backgroundColor: isHovered ? 'rgba(10, 63, 102, 0.25)' : 'transparent',
                    border: `1px solid ${isHovered ? '#1d6fa5' : '#2f2e2b'}`,
                    borderRadius: '2px',
                    color: isHovered ? '#e2f1f3' : '#96948c',
                    fontFamily: 'inherit',
                    fontSize: '0.78rem',
                    padding: '0.2rem 0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {user}
                </button>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
