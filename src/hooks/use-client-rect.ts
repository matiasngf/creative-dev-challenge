import { useEffect, useRef, useState } from 'react'

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
  const rectRef = useRef<Omit<DOMRect, 'toJSON'>>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    bottom: 0,
    right: 0
  })

  const [rect, setRect] = useState<Omit<DOMRect, 'toJSON'>>(rectRef.current)
  const yScroll = useScrollStore((s) => s.yScroll)

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    const { aborted } = signal

    const callback = () => {
      if (aborted || !el) return

      el
      const currentRect = el.getBoundingClientRect()
      if (
        rectRef.current.top !== currentRect.top ||
        rectRef.current.left !== currentRect.left ||
        rectRef.current.width !== currentRect.width ||
        rectRef.current.height !== currentRect.height
      ) {
        rectRef.current = currentRect
        setRect(currentRect)
      }
      requestAnimationFrame(callback)
    }
    requestAnimationFrame(callback)
    return () => {
      abortController.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [el])

  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    absoluteTop: rect.top + yScroll,
    absoluteLeft: rect.left
  }
}
