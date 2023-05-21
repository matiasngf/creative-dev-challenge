'use client'

import { Center, Float, Resize, useGLTF } from '@react-three/drei'
import { gsap } from 'gsap'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Group, Mesh, MeshStandardMaterial } from 'three'
import type { GLTF } from 'three-stdlib'

import { ThreePortal } from '~/components/common/three-portal'
import type { TrackerRendererProps } from '~/context/use-tracked-element'
import { useClientRect } from '~/hooks/use-client-rect'

import type { Cap } from '.'
import s from './caps.module.scss'

export interface CapTrackerProps {
  cap: Cap
}

interface CapPortalProps {
  cap: Cap
  element: HTMLDivElement | null
}

export const CapTracker = ({ cap }: CapTrackerProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const [capProps, setCapProps] = useState<CapPortalProps>({
    cap,
    element: ref.current
  })

  useEffect(() => {
    setCapProps((s) => ({
      ...s,
      element: ref.current
    }))
  }, [])

  return (
    <div
      ref={ref}
      className={s.cap}
      style={{
        left: cap.left,
        top: cap.top,
        right: cap.right,
        bottom: cap.bottom,
        transform: `scale(${cap.scale})`
      }}
    >
      <ThreePortal props={capProps} autoAdd renderer={CapPortal} />
    </div>
  )
}

interface CapGLTF extends GLTF {
  nodes: {
    Scene: Group
    Capv2: Group
    Sphere007: Mesh
    Sphere007_1: Mesh
  }
  materials: {
    'm_Cap-v2': MeshStandardMaterial
    m_Outline: MeshStandardMaterial
  }
}

useGLTF.preload('/models/cap.glb')

export const CapPortal = ({
  props
}: TrackerRendererProps<CapPortalProps, undefined>) => {
  const { nodes } = useGLTF('/models/cap.glb') as CapGLTF

  const { element } = props
  const rect = useClientRect(element)

  const SceneNode = useMemo(() => {
    const Scene = nodes.Capv2.clone(true)
    return Scene
  }, [nodes.Capv2])

  const groupRef = useRef<THREE.Group>(null)
  const randomY = useMemo(() => (Math.random() - 0.5) * Math.PI * 0.2 - 0.3, [])
  const randomX = useMemo(() => (Math.random() - 0.5) * Math.PI * 0.1 + 0.2, [])
  const randomZ = useMemo(() => (Math.random() - 0.5) * Math.PI * 0.05, [])

  useEffect(() => {
    if (!groupRef.current) return

    const triggerEl = document.getElementById('#capsContainer')
    // const randomRotation = Math.random() * Math.PI * 2

    gsap.to(groupRef.current.rotation, {
      x: randomX,
      y: randomY,
      scrollTrigger: {
        scrub: true,
        trigger: triggerEl,
        start: 'top top',
        end: 'bottom bottom'
      }
    })
  }, [randomY, randomX])

  const centerX = rect.absoluteLeft + rect.width / 2
  const centerY = rect.absoluteTop + rect.height / 2
  const scaleFactor = Math.max(rect.width, rect.height) * 1

  return (
    <group
      scale={[scaleFactor, scaleFactor, scaleFactor]}
      position={[centerX, -centerY, 500]}
      rotation={[randomX + 0.3, randomY + 0.3, randomZ]}
      ref={groupRef}
    >
      <Float>
        <Center>
          <Resize>
            <primitive object={SceneNode} />
          </Resize>
        </Center>
      </Float>
    </group>
  )
}
