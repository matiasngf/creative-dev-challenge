'use client'

import { Center, Float, Resize, useGLTF } from '@react-three/drei'
import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'
import type { Group, Mesh, MeshStandardMaterial } from 'three'
import type { GLTF } from 'three-stdlib'

import { TrackedDiv, useTrackedElement } from '~/context/use-tracked'
import { useClientRect } from '~/hooks/use-client-rect'

interface AwwardGLTF extends GLTF {
  nodes: {
    Cube001: Mesh
    Cube001_1: Mesh
    Scene: Group
    Awwwards: Group
  }
  materials: {
    m_Trophy3: MeshStandardMaterial
    m_Outline: MeshStandardMaterial
  }
}

useGLTF.preload('/models/awwwards.glb')

export const Awwward = () => {
  const { nodes } = useGLTF('/models/awwwards.glb') as AwwardGLTF
  const tracked = useTrackedElement<TrackedDiv>('awwward')
  const rect = useClientRect(tracked?.el)
  const groupRef = useRef<Group>(null)

  useEffect(() => {
    if (!groupRef.current) return

    gsap.to(groupRef.current.rotation, {
      y: Math.PI * -2,
      scrollTrigger: {
        scrub: true,
        trigger: 'body',
        start: 'top top',
        end: '1000px top'
      }
    })
  }, [])

  if (!tracked) return null

  const centerX = rect.absoluteLeft + rect.width / 2
  const centerY = rect.absoluteTop + rect.height / 2
  const scaleFactor = Math.max(rect.width, rect.height) * 0.7

  return (
    <>
      <group
        scale={[scaleFactor, scaleFactor, scaleFactor]}
        position={[centerX, -centerY + 25, 200]}
        rotation={[-0.1, 0, 0]}
        ref={groupRef}
      >
        <Float rotationIntensity={0.5} floatIntensity={0.2}>
          <Center>
            <Resize>
              <primitive object={nodes.Awwwards} />
            </Resize>
          </Center>
        </Float>
      </group>
    </>
  )
}
