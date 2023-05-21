'use client'

import type { ReactNode } from 'react'

import { SceneCamera } from './scene-camera'

export const PrimaryScene = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <SceneCamera />
      {children}
    </>
  )
}
