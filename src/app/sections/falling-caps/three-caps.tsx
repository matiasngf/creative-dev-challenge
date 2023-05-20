'use client'

import { Center, Float, Resize, useGLTF } from '@react-three/drei'
import { gsap } from 'gsap'
import { useEffect, useMemo, useRef } from 'react'
import type { Group, Mesh, MeshStandardMaterial } from 'three'
import type { GLTF } from 'three-stdlib'

import { TrackedDiv, useTrackedGroup } from '~/context/use-tracked'
import { useClientRect } from '~/hooks/use-client-rect'

export const ThreeCaps = () => {
  const trackedCaps = useTrackedGroup<TrackedDiv>('caps')

  return (
    <group>
      {trackedCaps.map((cap) => (
        <ThreeCap key={cap.id} {...cap} />
      ))}
    </group>
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

export const ThreeCap = ({ el }: TrackedDiv) => {
  const { nodes } = useGLTF('/models/cap.glb') as CapGLTF

  const SceneNode = useMemo(() => {
    const Scene = nodes.Capv2.clone(true)
    return Scene
  }, [nodes.Capv2])

  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (!groupRef.current) return

    const triggerEl = document.getElementById('#capsContainer')

    gsap.to(groupRef.current.rotation, {
      y: Math.PI * -2,
      scrollTrigger: {
        scrub: true,
        trigger: triggerEl,
        start: 'top top',
        end: 'bottom bottom'
      }
    })
  }, [])

  const rect = useClientRect(el)

  const centerX = rect.absoluteLeft + rect.width / 2
  const centerY = rect.absoluteTop + rect.height / 2
  const scaleFactor = Math.max(rect.width, rect.height) * 1

  return (
    <group
      scale={[scaleFactor, scaleFactor, scaleFactor]}
      position={[centerX, -centerY, 500]}
      rotation={[-0.1, 0, 0]}
      ref={groupRef}
    >
      <Float rotationIntensity={1} floatIntensity={0.3}>
        <Center>
          <Resize>
            <primitive object={SceneNode} />
          </Resize>
        </Center>
      </Float>
    </group>
  )
}
