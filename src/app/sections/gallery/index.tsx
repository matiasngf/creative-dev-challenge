'use client'

import React, { CSSProperties } from 'react'

import { ImageMaps, ThreeImage } from '~/components/common/three-image'
import { Container } from '~/components/layout/container'
import { useRegisterHover } from '~/context/use-mouse'
import { lensDistortionFragmentShader } from '~/lib/utils/lens-distortion'
import { swapMapFragmentShader } from '~/lib/utils/swap-maps-fragment'

import s from './gallery.module.scss'

type GalleryImage = {
  url: string
  style: CSSProperties
  fragmentShader?: string
  imageMaps?: ImageMaps
}

export const Gallery = () => {
  const images: GalleryImage[] = [
    {
      url: '/images/basement-team-1.jpg',
      style: {
        gridArea: '1 / 1 / 1 / 13'
      },
      fragmentShader: lensDistortionFragmentShader
    },
    {
      url: '/images/basement-team-2.jpg',
      style: {
        gridArea: '2 / 1 / 3 / 9'
      },
      fragmentShader: swapMapFragmentShader,
      imageMaps: {
        hoverTexture: '/images/basement-team-2-hover.jpg'
      }
    },
    {
      url: '/images/basement-team-3.jpg',
      style: {
        gridArea: '2 / 9 / 3 / 13'
      },
      fragmentShader: swapMapFragmentShader,
      imageMaps: {
        hoverTexture: '/images/basement-team-3-hover.jpg'
      }
    }
  ]

  const { registerHoveredElement, removeHoveredElement } = useRegisterHover()
  return (
    <Container
      as="section"
      className={s.container}
      onMouseEnter={registerHoveredElement}
      onMouseLeave={removeHoveredElement}
    >
      {images.map((image, index) => (
        <div key={index} className={s.imageContainer} style={image.style}>
          <ThreeImage
            alt="basement-team"
            fill
            priority
            quality={100}
            src={image.url}
            fragmentShader={image.fragmentShader}
            imageMaps={image.imageMaps}
          />
        </div>
      ))}
    </Container>
  )
}
