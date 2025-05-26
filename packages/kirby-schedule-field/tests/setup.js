import { vi } from 'vitest'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isBetween from 'dayjs/plugin/isBetween'

// Extend dayjs with required plugins
dayjs.extend(weekOfYear)
dayjs.extend(advancedFormat)
dayjs.extend(isBetween)

// Mock Kirby panel globals
globalThis.mockPanel = {
  plugin: vi.fn(),
  $t: vi.fn((key) => key), // Return the key as translation
  drawer: {
    open: vi.fn()
  }
}

// Mock Vue component properties that Kirby provides
const mockHelper = {
  field: {
    subfields: vi.fn((component, fields) => fields)
  },
  string: {
    uuid: vi.fn(() => 'mock-uuid-' + Math.random().toString(36).substr(2, 9)),
    camelToKebab: vi.fn((str) => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`))
  },
  debounce: vi.fn((fn, delay) => fn),
  isComponent: vi.fn(() => true)
}

const mockLibrary = {
  dayjs: dayjs
}

// Global mocks for Vue components
globalThis.$helper = mockHelper
globalThis.$library = mockLibrary
globalThis.$t = mockPanel.$t
globalThis.$panel = mockPanel

// Mock window.panel for plugin registration
if (typeof window !== 'undefined') {
  window.panel = mockPanel
}