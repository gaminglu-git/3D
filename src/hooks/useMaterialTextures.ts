'use client'

import { useEffect, useState, useMemo } from 'react'
import * as THREE from 'three'
import { VisualProperties } from '@/lib/types/materials'

type TextureStatus = 'loading' | 'success' | 'error'

interface TextureSet {
  colorMap?: THREE.Texture
  normalMap?: THREE.Texture
  roughnessMap?: THREE.Texture
  metalnessMap?: THREE.Texture
}

interface UseMaterialTexturesResult {
  textures: TextureSet
  status: TextureStatus
  error: any
}

const textureCache = new Map<string, THREE.Texture>()
const loader = new THREE.TextureLoader()

/**
 * Custom hook to load PBR textures for a material
 * Implements caching and proper texture configuration
 */
export function useMaterialTextures(
  materialVisual: VisualProperties | undefined,
): UseMaterialTexturesResult {
  const [textures, setTextures] = useState<TextureSet>({})
  const [status, setStatus] = useState<TextureStatus>('loading')
  const [error, setError] = useState<any>(null)

  const textureUrls = useMemo(
    () => ({
      colorMap: materialVisual?.texture,
      normalMap: materialVisual?.normalMap,
      roughnessMap: materialVisual?.roughnessMap,
      metalnessMap: materialVisual?.metalnessMap,
    }),
    [materialVisual],
  )

  useEffect(() => {
    if (!materialVisual) {
      setStatus('success')
      setTextures({})
      setError(null)
      return
    }

    let isMounted = true
    setStatus('loading')
    setError(null)

    const initialTextures: TextureSet = {}
    const urlsToLoad: { type: keyof TextureSet; url: string }[] = []

    Object.entries(textureUrls).forEach(([key, url]) => {
      if (url) {
        if (textureCache.has(url)) {
          initialTextures[key as keyof TextureSet] = textureCache.get(url)
        } else {
          urlsToLoad.push({ type: key as keyof TextureSet, url })
        }
      }
    })

    setTextures(initialTextures)

    if (urlsToLoad.length === 0) {
      setStatus('success')
      return
    }

    const loadPromises = urlsToLoad.map(async ({ type, url }) => {
      try {
        const texture = await loader.loadAsync(url)
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(1, 1)

        if (type === 'colorMap') {
          texture.colorSpace = THREE.SRGBColorSpace
        } else {
          texture.colorSpace = THREE.NoColorSpace
        }

        if (isMounted) {
          textureCache.set(url, texture)
          return { type, texture }
        } else {
          texture.dispose()
          return null
        }
      } catch (err) {
        console.error(`Failed to load texture: ${url}`, err)
        if (isMounted) {
          setError(err)
          setStatus('error')
        }
        throw err
      }
    })

    Promise.all(loadPromises)
      .then((loadedTextures) => {
        if (isMounted) {
          const newTextures = { ...initialTextures }
          loadedTextures.forEach((result) => {
            if (result) {
              newTextures[result.type] = result.texture
            }
          })
          setTextures(newTextures)
          setStatus('success')
        }
      })
      .catch(() => {
        // Error is set inside the promise catch block
      })

    return () => {
      isMounted = false
    }
  }, [materialVisual, textureUrls])

  return { textures, status, error }
}
