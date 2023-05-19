'use client'

import {
  DetailedHTMLProps,
  HTMLAttributes,
  PropsWithChildren,
  useEffect,
  useRef,
  useState
} from 'react'

import { useTrackedStore } from '~/context/use-tracked'
import { useSmooth } from '~/hooks/use-smooth'

export interface TrackedDivProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  id: string
  smoothHover?: number
  debug?: boolean
}

export const TrackedDiv = ({
  id,
  children,
  debug,
  smoothHover = 0.05,
  ...props
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
    <div
      id={id}
      style={{
        border: debug ? '1px solid red' : ''
      }}
      ref={ref}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
      {...props}
    >
      {children}
    </div>
  )
}
