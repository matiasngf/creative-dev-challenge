import { useEffect, useRef, useState } from 'react'
import { shallow } from 'zustand/shallow'

import { useScrollStore } from '~/context/use-scroll'

export interface ClientRect {
  top: number
  left: number
  width: number
  height: number
  absoluteTop: number
  absoluteLeft: number
}

export function useClientRect<T extends HTMLElement | null | undefined>(
  el: T
): ClientRect {
  const rectRef = useRef<ClientRect>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    absoluteTop: 0,
    absoluteLeft: 0
  })

  const [rect, setRect] = useState<ClientRect>(rectRef.current)
  const yScroll = useScrollStore((s) => s.yScroll)
  const yScrollRef = useRef(yScroll)
  useEffect(() => {
    yScrollRef.current = yScroll
  }, [yScroll])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    const { aborted } = signal

    const callback = () => {
      if (aborted || !el) return
      const boundingRect = el.getBoundingClientRect()

      const currentRect: ClientRect = {
        top: boundingRect.top,
        left: boundingRect.left,
        width: boundingRect.width,
        height: boundingRect.height,
        absoluteTop: boundingRect.top + yScrollRef.current,
        absoluteLeft: boundingRect.left
      }

      if (!shallow(currentRect, rectRef.current)) {
        rectRef.current = currentRect
        setRect(currentRect)
      }
      requestAnimationFrame(callback)
    }
    requestAnimationFrame(callback)
    return () => {
      abortController.abort()
    }
  }, [el])

  return rect
}
