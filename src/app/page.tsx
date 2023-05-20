import React from 'react'

import { AppCanvas } from '~/components/common/canvas'
import { PortalTargetContainer } from '~/components/common/three-portal/portal-target'

import { FallingCaps } from './sections/falling-caps'
import { FooterGallery } from './sections/footer-gallery'
import { Gallery } from './sections/gallery'
import { Hero } from './sections/hero'

const HomePage = () => {
  return (
    <>
      <Hero />
      <Gallery />
      <FallingCaps />
      <FooterGallery />
      <AppCanvas>
        <PortalTargetContainer />
      </AppCanvas>
    </>
  )
}

export default HomePage
