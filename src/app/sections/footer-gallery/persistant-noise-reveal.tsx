'use client'

import { OrthographicCamera, useFBO } from '@react-three/drei'
import {
  createPortal,
  OrthographicCameraProps,
  useFrame,
  useLoader
} from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { Camera, RGBAFormat, Scene, TextureLoader } from 'three'

import {
  defaultImageVertexShader,
  ImageRendererElement
} from '~/components/common/three-image/default-image-renderer'
import { useMouseStore } from '~/context/use-mouse'
import { useScrollStore } from '~/context/use-scroll'
import { useClientRect } from '~/hooks/use-client-rect'
import { useUniforms } from '~/hooks/use-uniforms'
import { imageGlobals } from '~/lib/utils/lens-distortion'
import { noiseMask } from '~/lib/utils/noise-mask'

export const PersistantNoiseReveal: ImageRendererElement = ({
  props,
  uniforms: portalUniforms
}) => {
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

  // Render alpha reveal
  const alphaTargetMap = useFBO({
    samples: 1,
    stencilBuffer: false,
    format: RGBAFormat
  })

  // Create uniforms
  const [uniforms, setUniforms] = useUniforms({
    fTime: 0,
    vMousePos: [0, 0],
    fYScroll: 0,
    vElementPos: [0, 0],
    vElementSize: [1, 1],
    alphaTexure: alphaTargetMap.texture
  })

  // Render alpha reveal
  const alphaRevealScene = useMemo(() => {
    const bgScene = new Scene()
    return bgScene
  }, [])
  const cam = useRef<Camera | null>(null)
  useFrame((state) => {
    if (!cam.current) return

    // Render alpha reveal
    state.gl.setRenderTarget(alphaTargetMap)
    state.gl.render(alphaRevealScene, cam.current)
    // Reset
    state.gl.setRenderTarget(null)
  })

  useEffect(() => {
    if (!cam.current) return

    const camProps = cam.current as unknown as OrthographicCameraProps
    camProps.left = -rect.width / 2
    camProps.right = rect.width / 2
    camProps.top = rect.height / 2
    camProps.bottom = -rect.height / 2
    camProps.updateProjectionMatrix?.()
  }, [rect])

  // Update uniforms
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
      {createPortal(
        <group
          position={[
            rect.absoluteLeft + rect.width / 2,
            -rect.absoluteTop - rect.height / 2,
            1
          ]}
        >
          <OrthographicCamera
            ref={cam}
            near={0.0}
            far={3000.0}
            makeDefault={false}
            position={[0, 0, 30]}
          />
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[rect.width, rect.height, 126, 126]} />
            <shaderMaterial
              vertexShader={defaultImageVertexShader}
              fragmentShader={persistantDefaultFragmentShader}
              uniforms={{
                ...portalUniforms,
                ...uniforms,
                ...imagesUniforms
              }}
            />
          </mesh>
        </group>,
        alphaRevealScene
      )}
      <planeGeometry args={[rect.width, rect.height, 126, 126]} />
      <shaderMaterial
        transparent
        vertexShader={vertexShader || defaultImageVertexShader}
        fragmentShader={fragmentShader || switchMapFragmentShader}
        uniforms={{
          ...portalUniforms,
          ...uniforms,
          ...imagesUniforms
        }}
      />
    </mesh>
  )
}

export const switchMapFragmentShader = /*glsl*/ `
${imageGlobals}
uniform sampler2D alphaTexure;

void main () {
  vec3 result = vec3(1.0);

  vec3 textureBase = texture2D(imageTexture, vUv).rgb;
  vec3 alphaT = texture2D(alphaTexure, vUv).rgb;

  gl_FragColor = vec4(textureBase, alphaT);
}

`

export const persistantDefaultFragmentShader = /*glsl*/ `
${imageGlobals}
uniform sampler2D alphaTexure;

${noiseMask}

void main () {
  vec3 p = wPos;
  vec3 result = vec3(0.0);
  vec2 realMousePos = vMousePos + vec2(0.0, fYScroll);
  vec3 shereCenter = vec3(realMousePos, 0.0);
  
  vec4 noiseP = vec4(p, fTime);
  float noiseRadius = 200.0;
  float noiseScale = 2.0;
  float noiseVelociy = 0.1;
  float noiseAmplitude = 30.0;
  NoiseMask noise = getNoiseMask(
    noiseP,
    shereCenter,
    noiseRadius,
    noiseScale,
    noiseVelociy,
    noiseAmplitude
  );

  float prevAlpha = texture2D(alphaTexure, vUv).r;
  prevAlpha = mix(0.0, prevAlpha, 0.995);
  float newAlpha = clamp(noise.inside + prevAlpha, 0.0, 1.0);

  result = vec3(newAlpha);

  gl_FragColor = vec4(result, 1.0);
}
`
