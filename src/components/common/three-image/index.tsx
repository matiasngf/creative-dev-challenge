'use client'

import Image, { ImageProps } from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { useMouseStore } from '~/context/use-mouse'
import { useScreenSizeStore } from '~/context/use-screen-size'
import { useSmooth } from '~/hooks/use-smooth'
import { useUniforms } from '~/hooks/use-uniforms'

import { ThreePortal } from '../three-portal'
import {
  DefaultImageRenderer,
  ImageRendererElement
} from './default-image-renderer'

export interface ThreeImageProps extends ImageProps {
  vertexShader?: string
  fragmentShader?: string
  imageMaps?: ImageMaps
  renderer?: ImageRendererElement
}

export interface ImageMaps {
  [key: string]: string
}

export interface ImagePortalProps {
  vertexShader: string | undefined
  fragmentShader: string | undefined
  el: HTMLImageElement | null
  imageMaps: ImageMaps
}

export type ImagePortalUniforms = {
  fHover: number
  fHoverSize: number
}

export const ThreeImage = ({
  vertexShader,
  fragmentShader,
  style = {},
  src,
  imageMaps = {},
  renderer = DefaultImageRenderer,
  ...props
}: ThreeImageProps) => {
  const ref = useRef<HTMLImageElement>(null)

  const imgSrc = src as string

  const [portalProps, setPortalProps] = useState<ImagePortalProps>({
    vertexShader,
    fragmentShader,
    el: ref.current,
    imageMaps: {
      imageTexture: imgSrc,
      ...imageMaps
    }
  })

  useEffect(() => {
    setPortalProps((s) => ({
      ...s,
      el: ref.current
    }))
  }, [ref])

  const hoverSize = useMouseStore((s) => s.size)
  const canvasWidth = useScreenSizeStore((s) => s.width)

  const scaledHoverSize = (canvasWidth / 1920) * hoverSize

  const [hovered, hover] = useState(false)
  const smoothHovered = useSmooth(+hovered, 0.05)
  const [uniforms, updateUniforms] = useUniforms<ImagePortalUniforms>({
    fHover: smoothHovered,
    fHoverSize: scaledHoverSize
  })

  useEffect(() => {
    updateUniforms({
      fHover: smoothHovered,
      fHoverSize: scaledHoverSize
    })
  }, [scaledHoverSize, smoothHovered, updateUniforms])

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
        renderer={renderer}
      />
    </>
  )
}
