import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMaterialTextures } from '../useMaterialTextures'
import * as THREE from 'three'

vi.mock('three', async () => {
  const actual = await vi.importActual('three')
  return {
    ...actual,
    TextureLoader: vi.fn(),
  }
})

describe('useMaterialTextures', () => {
  let mockLoader: any
  const mockTexture = {
    wrapS: 0,
    wrapT: 0,
    repeat: { set: vi.fn() },
    dispose: vi.fn(),
  }

  beforeEach(() => {
    mockLoader = {
      load: vi.fn((url, onLoad) => {
        if (onLoad) onLoad(mockTexture)
        return mockTexture
      }),
      loadAsync: vi.fn().mockResolvedValue(mockTexture),
    }
    vi.mocked(THREE.TextureLoader).mockImplementation(() => mockLoader)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return empty textures when no material visual is provided', () => {
    const { result } = renderHook(() => useMaterialTextures(undefined))
    expect(result.current.textures).toEqual({})
    expect(result.current.status).toBe('idle')
  })

  it('should return empty textures when material visual has no texture URLs', () => {
    const material = {
      color: '#ffffff',
    }
    const { result } = renderHook(() => useMaterialTextures(material))
    expect(result.current.textures).toEqual({})
    expect(result.current.status).toBe('idle')
  })

  it('should load textures successfully', async () => {
    const material = {
      colorMap: '/textures/test-color.jpg',
      normalMap: '/textures/test-normal.jpg',
    }
    const { result } = renderHook(() => useMaterialTextures(material))

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(result.current.status).toBe('success')
    expect(result.current.textures.colorMap).toBeDefined()
    expect(result.current.textures.normalMap).toBeDefined()
    expect(mockLoader.loadAsync).toHaveBeenCalledTimes(2)
  })

  it('should handle texture loading errors', async () => {
    const mockError = new Error('Failed to load texture')
    mockLoader.loadAsync.mockRejectedValue(mockError)
    const material = {
      colorMap: '/textures/test-color.jpg',
    }

    const { result } = renderHook(() => useMaterialTextures(material))

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(result.current.status).toBe('error')
    expect(result.current.error).toEqual(mockError)
  })

  it('should cache loaded textures', async () => {
    const material = {
      colorMap: '/textures/test-color.jpg',
    }
    const { rerender } = renderHook(
      ({ mat }) => useMaterialTextures(mat),
      { initialProps: { mat: material } },
    )

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    rerender({ mat: material })

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(mockLoader.loadAsync).toHaveBeenCalledTimes(1)
  })

  it('should set correct texture properties', async () => {
    const material = {
      colorMap: '/textures/test-color.jpg',
      repeat: [2, 3],
    }
    const { result } = renderHook(() => useMaterialTextures(material))

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    const texture = result.current.textures.colorMap
    expect(texture.wrapS).toBe(THREE.RepeatWrapping)
    expect(texture.wrapT).toBe(THREE.RepeatWrapping)
    expect(texture.repeat.set).toHaveBeenCalledWith(2, 3)
  })

  it('should cleanup textures on unmount', async () => {
    const material = {
      colorMap: '/textures/test-color.jpg',
    }
    const { result, unmount } = renderHook(() => useMaterialTextures(material))

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    const texture = result.current.textures.colorMap
    unmount()

    expect(texture.dispose).toHaveBeenCalled()
  })
})
