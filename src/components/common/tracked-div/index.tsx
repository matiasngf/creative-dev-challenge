'use-client'

import { PropsWithChildren, useEffect, useRef, useState } from 'react'

import { useTrackedStore } from '~/context/use-tracked'
import { useSmooth } from '~/hooks/use-smooth'

export interface TrackedDivProps {
  id: string
  smoothHover?: number
}

export const TrackedDiv = ({
  id,
  children,
  smoothHover = 0.05
}: PropsWithChildren<TrackedDivProps>) => {
  const ref = useRef<HTMLImageElement>(null)

  const trackElement = useTrackedStore((s) => s.trackElement)
  const untrackElement = useTrackedStore((s) => s.untrackElement)
  const updateUniforms = useTrackedStore((s) => s.updateUniforms)
  const [hovered, hover] = useState(false)
  const smoothHovered = useSmooth(+hovered, smoothHover)

  useEffect(() => {
    if (ref.current) {
      trackElement({
        id,
        type: 'div',
        el: ref.current,
        uniforms: {
          hover: 0
        }
      })
      return () => {
        untrackElement(id)
      }
    }
  }, [id, ref, trackElement, untrackElement])

  useEffect(() => {
    if (!ref.current) return
    updateUniforms(id, {
      hover: smoothHovered
    })
  }, [id, smoothHovered, updateUniforms])

  return (
    <div onPointerOver={() => hover(true)} onPointerOut={() => hover(false)}>
      {children} {smoothHovered.toFixed(2)}
    </div>
  )
}
