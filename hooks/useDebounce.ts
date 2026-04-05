'use client'

import { useState, useEffect } from 'react'

/**
 * Debounce a value by `delay` ms.
 * Returns the debounced value — use in a useEffect to trigger side effects.
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
