import { useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'

import { useMouseStore } from '~/context/use-mouse'
import { useScrollStore } from '~/context/use-scroll'
import type { TrackerRendererProps } from '~/context/use-tracked-element'
import { useClientRect } from '~/hooks/use-client-rect'
import { Uniforms, useUniforms } from '~/hooks/use-uniforms'

import type { ImagePortalProps, ImagePortalUniforms } from '.'

export const ImageRenderer = ({
  props,
  uniforms: imageUniforms
}: TrackerRendererProps<ImagePortalProps, Uniforms<ImagePortalUniforms>>) => {
  const { el, vertexShader, fragmentShader, imageMaps } = props
  const rect = useClientRect(el)
  const mouseRef = useMouseStore((s) => s.ref)

  const imagesMapsSrc = Object.values(imageMaps)
  const imagesMapKeys = Object.keys(imageMaps)
  const loadedImages = useLoader(TextureLoader, imagesMapsSrc)
  const imagesMaps = Object.fromEntries(
    imagesMapKeys.map((key, index) => [key, loadedImages[index]])
  )

  const [imagesUniforms] = useUniforms(imagesMaps)

  const yScrollRef = useScrollStore((s) => s.yScrollRef)
  const [uniforms, setUniforms] = useUniforms({
    fTime: 0,
    vMousePos: [0, 0],
    fYScroll: 0,
    vElementPos: [0, 0],
    vElementSize: [1, 1]
  })

  useFrame(({ clock }) => {
    setUniforms({
      fTime: clock.getElapsedTime(),
      vMousePos: [mouseRef.x, -mouseRef.y],
      fYScroll: -yScrollRef.current,
      vElementPos: [rect.absoluteLeft, -rect.absoluteTop - rect.height],
      vElementSize: [rect.width, rect.height]
    })
  })

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
          ...imageUniforms,
          ...uniforms,
          ...imagesUniforms
        }}
      />
    </mesh>
  )
}

const defaultVertexShader = /* glsl */ `
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 wPos;

void main() {
  vUv = uv;
  vNormal = normal;

  wPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const defaultFragmentShader = /* glsl */ `
  
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 wPos;
  uniform sampler2D imageTexture;

  void main() {
    vec3 textureColor = texture2D(imageTexture, vUv).rgb;
    gl_FragColor = vec4(textureColor, 1.0);
  }
`
