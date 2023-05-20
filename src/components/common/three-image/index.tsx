'use client'

import { useLoader } from '@react-three/fiber'
import Image, { ImageProps } from 'next/image'
import { useEffect, useId, useRef, useState } from 'react'
import { TextureLoader } from 'three'

import { useClientRect } from '~/hooks/use-client-rect'
import { useSmooth } from '~/hooks/use-smooth'
import { useUniforms } from '~/hooks/use-uniforms'

import { ThreePortal } from '../three-portal'

export interface ThreeImageProps extends ImageProps {
  vertexShader?: string
  fragmentShader?: string
}

export const ThreeImage = ({
  vertexShader,
  fragmentShader,
  style = {},
  src,
  ...props
}: ThreeImageProps) => {
  const id = useId()
  const ref = useRef<HTMLImageElement>(null)

  const imgSrc = src as string

  const rect = useClientRect(ref.current)

  const [portalProps, setPortalProps] = useState({
    vertexShader,
    fragmentShader,
    rect,
    imgSrc
  })

  useEffect(() => {
    setPortalProps((s) => ({
      ...s,
      rect,
      imgSrc
    }))
  }, [rect, imgSrc])

  const [hovered, hover] = useState(false)
  const smoothHovered = useSmooth(+hovered, 0.05)
  const [uniforms, updateUniforms] = useUniforms({
    fHover: smoothHovered
  })
  useEffect(() => {
    if (!ref.current) return
    updateUniforms({
      fHover: smoothHovered
    })
  }, [id, smoothHovered, updateUniforms])

  return (
    <>
      <Image
        src={src}
        onPointerMove={(_e) => {
          // TODO: add mouse tracker
          // const x = e.nativeEvent.offsetX
          // const y = e.nativeEvent.offsetY - e.target.offsetTop - 100
          // fRef.current.style.transform = `translate3d(${x}px,${y}px,0)`
        }}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
        ref={ref}
        style={{
          ...style,
          opacity: 0
        }}
        {...props}
      />
      <ThreePortal
        id={id}
        props={portalProps}
        uniforms={uniforms}
        updateUniforms={updateUniforms}
        autoAdd
        renderer={({ props }) => {
          const { rect, vertexShader, fragmentShader, imgSrc } = props

          const [imageTexture] = useLoader(TextureLoader, [imgSrc])

          return (
            <mesh
              key={id}
              position={[
                rect.absoluteLeft + rect.width / 2,
                -rect.absoluteTop - rect.height / 2,
                1
              ]}
            >
              <planeGeometry args={[rect.width, rect.height, 126, 126]} />
              <shaderMaterial
                vertexShader={vertexShader || defaultVertexShader}
                fragmentShader={fragmentShader || defaultFragmentShader}
                uniforms={{
                  ...uniforms,
                  imageTexture: { value: imageTexture }
                }}
              />
            </mesh>
          )
        }}
      />
    </>
  )
}

const defaultVertexShader = /* glsl */ `

  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`

const defaultFragmentShader = /* glsl */ `
  
  varying vec2 vUv;

  uniform float uTime;
  uniform float fHover;
  uniform sampler2D imageTexture;

  void main() {
    vec3 textureColor = texture2D(imageTexture, vUv).rgb;

    textureColor = mix(textureColor, vec3(1.0, 0.0, 0.0), fHover);
    gl_FragColor = vec4(textureColor, 1.0);
  }
`
