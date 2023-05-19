'use client'

import { Canvas } from '@react-three/fiber'
import { clsx } from 'clsx'
import type { ComponentProps, PropsWithChildren } from 'react'

import s from './canvas.module.scss'
import { PrimaryScene } from './primary-scene'

type CanvasProps = Omit<ComponentProps<typeof Canvas>, 'children'>

export const AppCanvas = ({
  className,
  children,
  ...props
}: PropsWithChildren<CanvasProps>) => {
  return (
    <>
      <Canvas className={clsx(className, s.main)} {...props}>
        <PrimaryScene>{children}</PrimaryScene>
      </Canvas>
    </>
  )
}
