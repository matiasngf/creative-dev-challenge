import { useEffect } from 'react'
import { create } from 'zustand'

class MousePositionRef {
  x = 0
  y = 0
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

  /** Set the mouse position */
  setPosition: (x: number, y: number) => void
  /** Register hovered element */
  registerHoveredElement: (id: string) => void
  /** Remove hovered element */
  removeHoveredElement: (id: string) => void
}

export const useMouseStore = create<MouseStore>((set) => ({
  x: 0,
  y: 0,
  hover: false,
  hoveredElements: [],
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
  }
}))

export const useTrackMouse = () => {
  const setPosition = useMouseStore((state) => state.setPosition)

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition(e.clientX, e.clientY)
    }

    window.addEventListener('mousemove', onMouseMove)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [setPosition])
}
