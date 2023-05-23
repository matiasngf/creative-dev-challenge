'use client'

import { useEffect, useId, useMemo } from 'react'
import { lerp } from 'three/src/math/MathUtils'
import { create } from 'zustand'

import { useScreenSizeStore } from './use-screen-size'

class MousePositionRef {
  x = 0
  y = 0
  size = 0
}

export interface MouseStore {
  /** X position in px relative to screen */
  x: number
  /** Y position in px relative to screen */
  y: number
  /** Whether the mouse is hovering something on the screen */
  hover: boolean
  /** Element Ids that are hovered */
  hoveredElements: string[]
  /** Reference to the mouse position */
  ref: MousePositionRef

  size: number

  /** Set the mouse position */
  setPosition: (x: number, y: number) => void
  /** Register hovered element */
  registerHoveredElement: (id: string) => void
  /** Remove hovered element */
  removeHoveredElement: (id: string) => void
  /** Function to update on frame */
  raf: () => void
}

export const useMouseStore = create<MouseStore>((set) => ({
  x: 0,
  y: 0,
  hover: false,
  hoveredElements: [],
  size: 40,
  ref: new MousePositionRef(),
  setPosition: (x, y) => {
    set((state) => {
      state.ref.x = x
      state.ref.y = y
      return {
        x,
        y
      }
    })
  },
  registerHoveredElement: (id) => {
    set((state) => {
      const newHovered = [...state.hoveredElements]
      if (!newHovered.includes(id)) {
        newHovered.push(id)
      }
      return {
        hoveredElements: newHovered,
        hover: newHovered.length > 0
      }
    })
  },
  removeHoveredElement: (id) => {
    set((state) => {
      const newHovered = [...state.hoveredElements].filter(
        (hoveredId) => hoveredId !== id
      )
      return {
        hoveredElements: newHovered,
        hover: newHovered.length > 0
      }
    })
  },
  raf: () => {
    set((state) => {
      const maxSize = 250
      const minSize = 40
      const targetSize = state.hover ? maxSize : minSize
      const currentSize = state.size

      if (currentSize === targetSize) return {}
      const size = Math.round(lerp(currentSize, targetSize, 0.1) * 10) / 10
      const sizeDiff = Math.abs(size - targetSize)
      const sizeIsClose = sizeDiff < 0.1

      const newSize = sizeIsClose ? targetSize : size
      state.ref.size = newSize
      return {
        size: newSize
      }
    })
  }
}))

export const useTrackMouseAndScreen = () => {
  const setPosition = useMouseStore((state) => state.setPosition)
  const raf = useMouseStore((state) => state.raf)

  const screenRaf = useScreenSizeStore((s) => s.raf)

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    const onMouseMove = (e: MouseEvent) => {
      setPosition(e.clientX, e.clientY)
    }

    const nextRaf = () => {
      if (signal.aborted) return
      raf()
      screenRaf()
      requestAnimationFrame(nextRaf)
    }
    nextRaf()

    window.addEventListener('mousemove', onMouseMove)

    return () => {
      abortController.abort()
      window.removeEventListener('mousemove', onMouseMove)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPosition])
}

export const useRegisterHover = () => {
  const id = useId()
  const mStore = useMouseStore(
    ({ registerHoveredElement, removeHoveredElement }) => ({
      registerHoveredElement,
      removeHoveredElement
    })
  )

  const registerHoveredElement = useMemo(
    () => () => mStore.registerHoveredElement(id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id]
  )
  const removeHoveredElement = useMemo(
    () => () => mStore.removeHoveredElement(id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id]
  )

  // unmount
  useEffect(() => {
    return () => {
      removeHoveredElement()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return {
    registerHoveredElement,
    removeHoveredElement
  }
}
