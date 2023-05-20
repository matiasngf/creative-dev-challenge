'use client'

import {
  DetailedHTMLProps,
  HTMLAttributes,
  PropsWithChildren,
  useEffect,
  useRef,
  useState
} from 'react'

import { TrackedHtml, useTrackedStoreDeprecated } from '~/context/use-tracked'
import { useSmooth } from '~/hooks/use-smooth'

export interface TrackedDivProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  id: string
  group?: string
  uniforms?: TrackedHtml['uniforms']
  smoothHover?: number
  debug?: boolean
}

export const TrackedDiv = ({
  id,
  group,
  uniforms = {},
  children,
  debug,
  style = {},
  smoothHover = 0.05,
  ...props
}: PropsWithChildren<TrackedDivProps>) => {
  const ref = useRef<HTMLImageElement>(null)

  const trackElement = useTrackedStoreDeprecated((s) => s.trackElement)
  const untrackElement = useTrackedStoreDeprecated((s) => s.untrackElement)
  const updateUniforms = useTrackedStoreDeprecated((s) => s.updateUniforms)
  const [hovered, hover] = useState(false)
  const smoothHovered = useSmooth(+hovered, smoothHover)

  useEffect(() => {
    if (ref.current) {
      trackElement({
        id,
        type: 'div',
        group,
        el: ref.current,
        uniforms: {
          hover: 0,
          ...uniforms
        }
      })
      return () => {
        untrackElement(id)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, ref, trackElement, untrackElement])

  useEffect(() => {
    if (!ref.current) return
    updateUniforms(id, {
      hover: smoothHovered,
      ...uniforms
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, smoothHovered, updateUniforms, JSON.stringify(uniforms)])

  return (
    <div
      id={id}
      style={{
        ...style,
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
