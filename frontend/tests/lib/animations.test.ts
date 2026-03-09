import { describe, it, expect } from 'vitest'
import { TRANSITION_TIMING, EASING, interactionClasses } from '@/lib/animations'

describe('Micro-interactions (COMP-11)', () => {
  describe('Animation Timing Constants', () => {
    it('TRANSITION_TIMING.fast equals 100ms (click feedback)', () => {
      expect(TRANSITION_TIMING.fast).toBe(100)
    })

    it('TRANSITION_TIMING.normal equals 150ms (hover transitions)', () => {
      expect(TRANSITION_TIMING.normal).toBe(150)
    })

    it('TRANSITION_TIMING.slow equals 200ms (modal animations)', () => {
      expect(TRANSITION_TIMING.slow).toBe(200)
    })
  })

  describe('Easing Curves', () => {
    it('EASING.easeInOut is defined', () => {
      expect(EASING.easeInOut).toBe('cubic-bezier(0.4, 0, 0.2, 1)')
    })

    it('EASING.easeOut is defined', () => {
      expect(EASING.easeOut).toBe('cubic-bezier(0, 0, 0.2, 1)')
    })

    it('EASING.easeIn is defined', () => {
      expect(EASING.easeIn).toBe('cubic-bezier(0.4, 0, 1, 1)')
    })
  })

  describe('interactionClasses utility', () => {
    it('returns transition-all duration-150 for hover transitions', () => {
      const classes = interactionClasses()
      expect(classes).toContain('transition-all')
      expect(classes).toContain('duration-150')
    })

    it('returns active:scale for click feedback', () => {
      const classes = interactionClasses()
      expect(classes).toContain('active:scale')
    })

    it('returns focus-visible:ring for focus ring', () => {
      const classes = interactionClasses()
      expect(classes).toContain('focus-visible:ring-2')
      expect(classes).toContain('focus-visible:ring-ring')
    })

    it('returns hover classes for hover state', () => {
      const classes = interactionClasses()
      expect(classes).toContain('hover:bg-accent')
      expect(classes).toContain('hover:text-accent-foreground')
    })

    it('merges with custom classes', () => {
      const classes = interactionClasses('custom-class another-class')
      expect(classes).toContain('custom-class')
      expect(classes).toContain('another-class')
    })
  })
})
