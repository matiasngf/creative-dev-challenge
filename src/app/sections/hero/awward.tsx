'use client'

import { Center, Float, Resize, useGLTF } from '@react-three/drei'
import { gsap } from 'gsap'
import { useEffect, useRef, useState } from 'react'
import type { Group, Mesh, MeshStandardMaterial } from 'three'
import type { GLTF } from 'three-stdlib'

import { ThreePortal } from '~/components/common/three-portal'
import type { TrackerRendererProps } from '~/context/use-tracked-element'
import { ClientRect, useClientRect } from '~/hooks/use-client-rect'

interface AwwardProps {
  rect: ClientRect
}

export const AwwwardTracker = () => {
  const ref = useRef<HTMLDivElement>(null)
  const rect = useClientRect(ref.current)

  const [awwardProps, setAwwardProps] = useState<AwwardProps>({
    rect
  })

  useEffect(() => {
    setAwwardProps((s) => ({
      ...s,
      rect
    }))
  }, [rect])

  return (
    <div ref={ref}>
      <ThreePortal props={awwardProps} autoAdd renderer={AwwwardPortal} />
    </div>
  )
}

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

export const AwwwardPortal = ({
  props
}: TrackerRendererProps<AwwardProps, undefined>) => {
  const { rect } = props

  const { nodes } = useGLTF('/models/awwwards.glb') as AwwardGLTF
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
