import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'

import type { TrackerElementProps } from '~/context/use-tracked-element'
import type { Uniforms } from '~/hooks/use-uniforms'

import type { ImagePortalProps, ImagePortalUniforms } from '.'

export const ImageRenderer = ({
  props,
  uniforms
}: TrackerElementProps<ImagePortalProps, Uniforms<ImagePortalUniforms>>) => {
  const { rect, vertexShader, fragmentShader, imgSrc } = props

  const [imageTexture] = useLoader(TextureLoader, [imgSrc])

  return (
    <mesh
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
