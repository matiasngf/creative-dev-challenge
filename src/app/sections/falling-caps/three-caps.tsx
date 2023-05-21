'use client'

import { Center, Float, Resize, useGLTF } from '@react-three/drei'
import { gsap } from 'gsap'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Group, Mesh, MeshStandardMaterial } from 'three'
import type { GLTF } from 'three-stdlib'

import { ThreePortal } from '~/components/common/three-portal'
import type { TrackerRendererProps } from '~/context/use-tracked-element'
import { useClientRect } from '~/hooks/use-client-rect'
import { useUniforms } from '~/hooks/use-uniforms'

import type { Cap } from '.'
import { capShaderMaterial, StandardShaderMaterial } from './cap-material'
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
  const { element } = props
  const rect = useClientRect(element)

  const [uniforms, updateUniforms] = useUniforms({
    fReveal: 0
  })

  // animation config
  const groupRef = useRef<THREE.Group>(null)
  const randomY = useMemo(() => (Math.random() - 0.5) * Math.PI * 0.2 - 0.3, [])
  const randomX = useMemo(() => (Math.random() - 0.5) * Math.PI * 0.1 + 0.2, [])
  const randomZ = useMemo(() => (Math.random() - 0.5) * Math.PI * 0.05, [])
  const randomStart = useMemo(() => {
    const min = 50
    const max = 80
    return Math.random() * (max - min) + min
  }, [])

  // tween
  const twRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    if (!groupRef.current) return

    const triggerEl = document.getElementById('#capsContainer')

    const g = gsap.to(groupRef.current.rotation, {
      x: randomX,
      y: randomY,
      scrollTrigger: {
        scrub: true,
        trigger: triggerEl,
        start: randomStart + '% bottom',
        end: randomStart + 20 + '% bottom'
      },
      onUpdate: () => {
        updateUniforms({
          fReveal: g.progress()
        })
      }
    })
    twRef.current = g

    return () => {
      g.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomY, randomX, randomStart, groupRef.current])

  const progress = twRef.current?.totalProgress() || 0

  // materials
  const { nodes } = useGLTF('/models/cap.glb') as CapGLTF
  const SceneNode = useMemo(() => {
    const Scene = nodes.Capv2.clone(true)

    Scene.traverse((child) => {
      if (
        child instanceof Mesh &&
        child.material instanceof MeshStandardMaterial
      ) {
        const newMaterial = capShaderMaterial(uniforms).copy(child.material)
        newMaterial.transparent = true
        child.material = newMaterial
      }
    })

    return Scene
  }, [nodes.Capv2, uniforms])

  const centerX = rect.absoluteLeft + rect.width / 2
  const centerY = rect.absoluteTop + rect.height / 2

  const padding = 0.6
  const scaleFactor = rect.width * padding * (1 - 0.3 * (1 - progress))

  return (
    <group
      scale={[scaleFactor, scaleFactor, scaleFactor]}
      position={[centerX, -centerY, 500]}
      rotation={[randomX + 0.3, randomY + 0.3, randomZ]}
      ref={groupRef}
    >
      <Float>
        <Center>
          <Resize width>
            <primitive object={SceneNode} />
          </Resize>
        </Center>
      </Float>
    </group>
  )
}
