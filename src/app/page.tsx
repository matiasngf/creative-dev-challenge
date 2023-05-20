import React from 'react'

import { AppCanvas } from '~/components/common/canvas'

import { FallingCaps } from './sections/falling-caps'
import { ThreeCaps } from './sections/falling-caps/three-caps'
import { FooterGallery } from './sections/footer-gallery'
import { Gallery } from './sections/gallery'
import { Hero } from './sections/hero'
import { Awwward } from './sections/hero/awward'

const HomePage = () => {
  return (
    <>
      <Hero />
      <Gallery />
      <FallingCaps />
      <FooterGallery />
      <AppCanvas>
        <Awwward />
        <ThreeCaps />
      </AppCanvas>
    </>
  )
}

export default HomePage
