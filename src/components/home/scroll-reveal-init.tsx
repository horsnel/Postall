'use client'

import { useEffect } from 'react'

/**
 * Initializes IntersectionObserver for CSS-based scroll reveal animations.
 * Elements with class .reveal, .reveal-left, .reveal-right, .reveal-scale
 * get .visible added when they enter the viewport.
 */
export function ScrollRevealInit() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
    if (!els.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '-50px' }
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return null
}
