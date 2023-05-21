import type { Uniforms } from '~/hooks/use-uniforms'
import { StandardShaderMaterial } from '~/lib/standard-shader-material'
import { noise4d1 } from '~/lib/utils/shaders'

export const capShaderMaterial = (uniforms: Uniforms) =>
  new StandardShaderMaterial({
    uniforms,
    vertexShaderBefore: /*glsl*/ `
      varying vec3 wPos;
    `,
    vertexShader: /*glsl*/ `
      vec4 worldNormal = modelMatrix * vec4(normal, 1.0);
      vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
      wPos = worldPosition.xyz;
      mvPosition = viewMatrix * worldPosition;
      gl_Position = projectionMatrix * mvPosition;
    `,
    fragmentShaderBefore: /*glsl*/ `
      uniform float fReveal;
      uniform float fTime;
      uniform float fSize;
      uniform vec3 vCenter;
      varying vec3 wPos;

      ${noise4d1}
    `,
    fragmentShader: /*glsl*/ `
      vec3 red = vec3(1.0, 0.0, 0.0);
      vec3 green = vec3(0.0, 1.0, 0.0);
      float borderSize = 5.0;

      vec3 p = wPos;
      vec3 sphereCenter = vCenter + vec3(-fSize * 0.2, -fSize * 0.3, fSize * 0.2);
      float sphereRadius = fSize * fReveal - borderSize * 2.0;

      float noiseDisplacement = fTime * 0.3;

      float noiseFactor = noise4d1(vec4(p.xyz / 20.0, noiseDisplacement)) * 10.0;
      float distance = length(sphereCenter - p) + noiseFactor;

      float sdf = distance - sphereRadius;
      float inside = sdf < 0.0 ? 1.0 : 0.0;
      float border = sdf < borderSize ? 1.0 : 0.0;

      vec3 borderColor = vec3(1.,0.302,0.);
      
      vec3 result = mix(borderColor, gl_FragColor.rgb, inside);

      gl_FragColor.rgb = result;
      gl_FragColor.a = border;
    `
  })
