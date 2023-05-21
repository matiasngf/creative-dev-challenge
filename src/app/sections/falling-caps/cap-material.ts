import type { Uniforms } from '~/hooks/use-uniforms'
import { StandardShaderMaterial } from '~/lib/standard-shader-material'

export const capShaderMaterial = (uniforms: Uniforms) =>
  new StandardShaderMaterial({
    uniforms,
    fragmentShaderBefore: /*glsl*/ `
      uniform float fReveal;
    `,
    fragmentShader: /*glsl*/ `
      vec3 red = vec3(1.0, 0.0, 0.0);
      vec3 green = vec3(0.0, 1.0, 0.0);

      vec3 result = mix(red, green, fReveal);
      gl_FragColor.rgb = result;
      gl_FragColor.a = fReveal;
    `
  })
