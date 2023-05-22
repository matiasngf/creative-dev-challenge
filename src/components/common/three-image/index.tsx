'use client'

import Image, { ImageProps } from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { useSmooth } from '~/hooks/use-smooth'
import { useUniforms } from '~/hooks/use-uniforms'

import { ThreePortal } from '../three-portal'
import { ImageRenderer } from './renderer'

export interface ThreeImageProps extends ImageProps {
  vertexShader?: string
  fragmentShader?: string
}

export interface ImagePortalProps {
  vertexShader: string | undefined
  fragmentShader: string | undefined
  imgSrc: string
  el: HTMLImageElement | null
}

export type ImagePortalUniforms = {
  fHover: number
}

export const ThreeImage = ({
  vertexShader,
  fragmentShader,
  style = {},
  src,
  ...props
}: ThreeImageProps) => {
  const ref = useRef<HTMLImageElement>(null)

  const imgSrc = src as string

  const [portalProps, setPortalProps] = useState<ImagePortalProps>({
    vertexShader,
    fragmentShader,
    imgSrc,
    el: ref.current
  })

  useEffect(() => {
    setPortalProps((s) => ({
      ...s,
      el: ref.current,
      imgSrc
    }))
  }, [imgSrc, ref])

  const [hovered, hover] = useState(false)
  const smoothHovered = useSmooth(+hovered, 0.05)
  const [uniforms, updateUniforms] = useUniforms<ImagePortalUniforms>({
    fHover: smoothHovered
  })
  useEffect(() => {
    if (!ref.current) return
    updateUniforms({
      fHover: smoothHovered
    })
  }, [smoothHovered, updateUniforms])

  return (
    <>
      <Image
        src={src}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
        ref={ref}
        style={{
          ...style,
          opacity: 0
        }}
        {...props}
      />
      <ThreePortal
        props={portalProps}
        uniforms={uniforms}
        autoAdd
        renderer={ImageRenderer}
      />
    </>
  )
}
