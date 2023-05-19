'use client'

import Image, { ImageProps } from 'next/image'
import { useEffect, useId, useRef } from 'react'

import { useTrackedStore } from '~/context/use-tracked'

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

  const trackElement = useTrackedStore((s) => s.trackElement)

  useEffect(() => {
    if (ref.current) {
      trackElement({
        id,
        type: 'image',
        el: ref.current,
        vertexShader,
        fragmentShader,
        autoAdd: true
      })
    }
  }, [id, ref, trackElement, vertexShader, fragmentShader])

  return (
    <>
      <Image
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
