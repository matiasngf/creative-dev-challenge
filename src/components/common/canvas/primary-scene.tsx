'use client'

import type { ReactNode } from 'react'

import { ThreeImageRenderer } from '~/components/common/three-image/renderer'
import { TrackedImage, useTrackedStore } from '~/context/use-tracked'

import { SceneCamera } from './scene-camera'

export const PrimaryScene = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <SceneCamera />
      {children}
      <AutoImages />
    </>
  )
}

const AutoImages = () => {
  const images = useTrackedStore((s) =>
    Object.values(s.trackedElements).filter(
      (e) => e.type === 'image' && e.autoAdd
    )
  ) as TrackedImage[]

  return (
    <>
      {images.map((image) => (
        <ThreeImageRenderer key={image.id} {...image} />
      ))}
    </>
  )
}
