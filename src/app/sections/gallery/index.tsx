import React, { CSSProperties } from 'react'

import { ThreeImage } from '~/components/common/three-image'
import { Container } from '~/components/layout/container'
import { imageDistortionFragment } from '~/lib/utils/lens-distortion'

import s from './gallery.module.scss'

type GalleryImage = {
  url: string
  style: CSSProperties
  fragmentShader?: string
}

export const Gallery = () => {
  const images: GalleryImage[] = [
    {
      url: '/images/basement-team-1.jpg',
      style: {
        gridArea: '1 / 1 / 1 / 13'
      },
      fragmentShader: imageDistortionFragment
    },
    {
      url: '/images/basement-team-2.jpg',
      style: {
        gridArea: '2 / 1 / 3 / 9'
      },
      fragmentShader: imageDistortionFragment
    },
    {
      url: '/images/basement-team-3.jpg',
      style: {
        gridArea: '2 / 9 / 3 / 13'
      },
      fragmentShader: imageDistortionFragment
    }
  ]
  return (
    <Container as="section" className={s.container}>
      {images.map((image, index) => (
        <div key={index} className={s.imageContainer} style={image.style}>
          <ThreeImage
            alt="basement-team"
            fill
            priority
            quality={100}
            src={image.url}
            fragmentShader={image.fragmentShader}
          />
        </div>
      ))}
    </Container>
  )
}
