import React, { CSSProperties } from 'react'

import { ImageMaps, ThreeImage } from '~/components/common/three-image'
import { Container } from '~/components/layout/container'

import s from './footer-gallery.module.scss'
import { PersistantNoiseReveal } from './persistant-noise-reveal'

type GalleryImage = {
  url: string
  style: CSSProperties
  fragmentShader?: string
  imageMaps?: ImageMaps
}

export const FooterGallery = () => {
  const images: GalleryImage[] = [
    {
      url: '/images/basement-team-4.jpg',
      style: {
        gridArea: '1 / 1 / 2 / 6'
      }
    },
    {
      url: '/images/basement-team-5.jpg',
      style: {
        gridArea: '1 / 6 / 2 / 13'
      }
    }
  ]
  return (
    <Container as="section" className={s.container}>
      {images.map((image, index) => (
        <div key={index} className={s.image} style={image.style}>
          <ThreeImage
            alt="basement-team"
            fill
            priority
            quality={100}
            src={image.url}
            fragmentShader={image.fragmentShader}
            imageMaps={image.imageMaps}
            renderer={PersistantNoiseReveal}
          />
        </div>
      ))}
    </Container>
  )
}
