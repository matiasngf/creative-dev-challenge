import { useFrame, useLoader } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { TextureLoader } from 'three'

import type { TrackedImage } from '~/context/use-tracked'
import { useClientRect } from '~/hooks/use-client-rect'

export const ThreeImageRenderer = ({
  id,
  el,
  uniforms = {},
  vertexShader,
  fragmentShader
}: TrackedImage) => {
  const ref = useRef(null)
  const rect = useClientRect(el)
  const [imageTexture] = useLoader(TextureLoader, [el.src])

  const uniformsObject = useMemo(() => {
    const u = {
      uTime: { value: 0 },
      imageTexture: { value: imageTexture }
    }
    Object.entries(uniforms).forEach(([key, value]) => {
      ;(u as any)[key] = { value }
    })
    return u
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const uniformsRef = useRef(uniformsObject)

  useFrame((_, delta) => {
    uniformsRef.current.uTime.value += delta
  })

  useEffect(() => {
    if (uniforms) {
      Object.entries(uniforms).forEach(([key, value]) => {
        if (!(key in uniformsRef.current)) return
        ;(uniformsRef.current as any)[key].value = value
      })
    }
  }, [uniforms])

  return (
    <mesh
      ref={ref}
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
        uniforms={uniformsRef.current}
      />
    </mesh>
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
  uniform float hover;
  uniform sampler2D imageTexture;

  void main() {
    vec3 textureColor = texture2D(imageTexture, vUv).rgb;

    textureColor = mix(textureColor, vec3(1.0, 0.0, 0.0), hover);
    gl_FragColor = vec4(textureColor, 1.0);
  }
`
