import { useFrame, useLoader } from '@react-three/fiber'
import { useRef } from 'react'
import { TextureLoader } from 'three'

import type { TrackedImage } from '~/context/use-tracked'
import { useClientRect } from '~/hooks/use-client-rect'
import { useUniforms } from '~/hooks/use-uniforms'

export const ThreeImageRenderer = ({
  id,
  el,
  uniforms: inputUniforms = {},
  vertexShader,
  fragmentShader
}: TrackedImage) => {
  const ref = useRef(null)
  const rect = useClientRect(el)
  const [imageTexture] = useLoader(TextureLoader, [el.src])

  const [uniforms, updateUniforms] = useUniforms({
    uTime: 0,
    imageTexture,
    ...inputUniforms
  })

  useFrame((_, delta) => {
    updateUniforms({
      uTime: uniforms.uTime.value + delta
    })
  })

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
        uniforms={uniforms}
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
