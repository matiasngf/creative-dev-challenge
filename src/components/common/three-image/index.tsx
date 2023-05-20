'use client'

import Image, { ImageProps } from 'next/image'
import { useEffect, useId, useRef, useState } from 'react'

import { ClientRect, useClientRect } from '~/hooks/use-client-rect'
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
  rect: ClientRect
  imgSrc: string
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
  const id = useId()
  const ref = useRef<HTMLImageElement>(null)

  const imgSrc = src as string

  const rect = useClientRect(ref.current)

  const [portalProps, setPortalProps] = useState({
    vertexShader,
    fragmentShader,
    rect,
    imgSrc
  })

  useEffect(() => {
    setPortalProps((s) => ({
      ...s,
      rect,
      imgSrc
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(rect), imgSrc])

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
  }, [id, smoothHovered, updateUniforms])

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
        id={id}
        props={portalProps}
        uniforms={uniforms}
        autoAdd
        renderer={ImageRenderer}
      />
    </>
  )
}
