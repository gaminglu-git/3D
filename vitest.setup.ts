import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Mock the entire @dimforge/rapier3d module
vi.mock('@dimforge/rapier3d', () => {
  return {
    World: vi.fn(() => ({
      step: vi.fn(),
      forEachCollider: vi.fn(),
      getCollider: vi.fn(),
    })),
    RigidBodyDesc: {
      dynamic: vi.fn(() => ({})),
    },
    ColliderDesc: {
      cuboid: vi.fn(() => ({})),
    },
    EventQueue: vi.fn(() => ({
      drainCollisionEvents: vi.fn(),
    })),
    init: vi.fn().mockResolvedValue(null),
  }
})

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock window.matchMedia (needed for responsive components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver (needed for some components)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
} as any

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver

vi.mock('three/src/loaders/TextureLoader', () => ({
  TextureLoader: vi.fn().mockImplementation(() => ({
    load: vi.fn(),
  })),
}))
