'use client'

import { OrthographicCamera } from '@react-three/drei'
import type { OrthographicCameraProps } from '@react-three/fiber'
import { useEffect, useRef } from 'react'

import { useScrollStore } from '~/context/use-scroll'
import { useCanvasSize } from '~/hooks/use-canvas-size'

export const SceneCamera = () => {
  const cameraRef = useRef<OrthographicCameraProps>(null)
  const { width, height } = useCanvasSize()
  const yScroll = useScrollStore((s) => s.yScroll)

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.left = -width / 2
      cameraRef.current.right = width / 2
      cameraRef.current.top = height / 2
      cameraRef.current.bottom = -height / 2
      cameraRef.current.updateProjectionMatrix?.()
    }
  }, [width, height])

  return (
    <OrthographicCamera
      ref={cameraRef}
      near={0.0}
      far={3000}
      position={[width / 2, -yScroll - height / 2, 2000]}
      makeDefault
    />
  )
}
