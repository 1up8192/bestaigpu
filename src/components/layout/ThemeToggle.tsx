'use client'

import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  localStorage.setItem('theme', theme)
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')

    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme)
      document.documentElement.dataset.theme = savedTheme
    }
  }, [])

  const isLight = theme === 'light'

  return (
    <button
      type="button"
      aria-checked={isLight}
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      className="inline-flex items-center gap-2 px-1 py-1 text-[var(--color-text)] text-sm transition-colors hover:text-[var(--color-text-bright)]"
      role="switch"
      onClick={() => {
        const nextTheme = isLight ? 'dark' : 'light'
        setTheme(nextTheme)
        applyTheme(nextTheme)
      }}
    >
      <Moon
        aria-hidden="true"
        className={isLight ? 'text-[var(--color-text-dim)]' : ''}
        size={13}
      />
      <span className="relative h-4 w-8 rounded-full bg-[var(--color-line)]">
        <span
          className="absolute top-0.5 left-0.5 h-3 w-3 rounded-full bg-[var(--color-green)] transition-transform data-[state=light]:translate-x-4"
          data-state={theme}
        />
      </span>
      <Sun aria-hidden="true" className={isLight ? '' : 'text-[var(--color-text-dim)]'} size={13} />
    </button>
  )
}
