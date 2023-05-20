'use client'

import Image, { ImageProps } from 'next/image'
import { useEffect, useId, useRef, useState } from 'react'

import { useTrackedStoreDeprecated } from '~/context/use-tracked'
import { useSmooth } from '~/hooks/use-smooth'

export interface ThreeImageProps extends ImageProps {
  vertexShader?: string
  fragmentShader?: string
}

export const ThreeImage = ({
  vertexShader,
  fragmentShader,
  style = {},
  ...props
}: ThreeImageProps) => {
  const id = useId()
  const ref = useRef<HTMLImageElement>(null)

  const trackElement = useTrackedStoreDeprecated((s) => s.trackElement)
  const untrackElement = useTrackedStoreDeprecated((s) => s.untrackElement)
  const updateUniforms = useTrackedStoreDeprecated((s) => s.updateUniforms)
  const [hovered, hover] = useState(false)
  const smoothHovered = useSmooth(+hovered, 0.05)

  useEffect(() => {
    if (ref.current) {
      trackElement({
        id,
        type: 'image',
        el: ref.current,
        vertexShader,
        fragmentShader,
        autoAdd: true,
        uniforms: {
          hover: 0
        }
      })
      return () => {
        untrackElement(id)
      }
    }
  }, [id, ref, trackElement, untrackElement, vertexShader, fragmentShader])

  useEffect(() => {
    if (!ref.current) return
    updateUniforms(id, {
      hover: smoothHovered
    })
  }, [id, smoothHovered, updateUniforms])

  return (
    <>
      <Image
        onPointerMove={(_e) => {
          // TODO: add mouse tracker
          // const x = e.nativeEvent.offsetX
          // const y = e.nativeEvent.offsetY - e.target.offsetTop - 100
          // fRef.current.style.transform = `translate3d(${x}px,${y}px,0)`
        }}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
        ref={ref}
        style={{
          ...style,
          opacity: 0
        }}
        {...props}
      />
    </>
  )
}
