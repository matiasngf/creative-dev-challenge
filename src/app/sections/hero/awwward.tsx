'use client'

import { Center, Float, Resize, useGLTF } from '@react-three/drei'
import { gsap, Power2 } from 'gsap'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Group, Mesh, MeshStandardMaterial } from 'three'
import type { GLTF } from 'three-stdlib'

import { ThreePortal } from '~/components/common/three-portal'
import type { TrackerRendererProps } from '~/context/use-tracked-element'
import { ClientRect, useClientRect } from '~/hooks/use-client-rect'
import { useUniforms } from '~/hooks/use-uniforms'

import { compileAwwwardShader } from './awwward-material'

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

  const [uniforms, setUniforms] = useUniforms({
    fReveal: 0,
    vPos: [0.0, 0.5]
  })

  const SceneNode = useMemo(() => {
    const Result = new Group()

    const Scene = nodes.Awwwards.clone(true)

    Scene.traverse((child) => {
      if (
        child instanceof Mesh &&
        child.material instanceof MeshStandardMaterial
      ) {
        const randomId = Math.random().toString(36).substring(7)
        const newObject = child.clone(true)
        const newMaterial = newObject.material.clone() as MeshStandardMaterial

        if (child.name === 'Cube001') {
          // fix map offset
          newMaterial.emissiveMap?.repeat.set(0.98, 0.986)
          newMaterial.emissiveMap?.offset.set(0.015, 0.01)
        }

        newMaterial.onBeforeCompile = compileAwwwardShader(uniforms)
        newMaterial.transparent = true
        newMaterial.needsUpdate = true
        newMaterial.customProgramCacheKey = function () {
          return randomId
        }
        newObject.material = newMaterial
        Result.add(newObject)
      }
    })

    return Result
  }, [nodes.Awwwards, uniforms])

  const groupRef = useRef<Group>(null)

  useEffect(() => {
    if (!groupRef.current) return

    const t1 = gsap.to(groupRef.current.rotation, {
      y: Math.PI * -2,
      scrollTrigger: {
        scrub: true,
        trigger: 'body',
        start: 'top top',
        end: '1000px top'
      }
    })
    const t2 = gsap.to(uniforms.fReveal, {
      value: 1,
      delay: 1,
      duration: 1.5,
      ease: Power2.easeOut
    })
    return () => {
      t1.kill()
      t2.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const topPos = -rect.absoluteTop
  const bottomPos = -rect.absoluteTop - rect.height

  useEffect(() => {
    setUniforms({
      vPos: [topPos, bottomPos]
    })
  }, [topPos, bottomPos, setUniforms])

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
              <primitive object={SceneNode} />
            </Resize>
          </Center>
        </Float>
      </group>
    </>
  )
}
