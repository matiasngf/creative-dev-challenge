import type { Uniforms } from '~/hooks/use-uniforms'
import { buildCompile } from '~/lib/standard-shader-material'
import { noise4d1 } from '~/lib/utils/shaders'

export const compileCapShader = (uniforms: Uniforms) => {
  return buildCompile({
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
      // https://www.shadertoy.com/view/cly3WV
      vec3 red = vec3(1.0, 0.0, 0.0);
      vec3 green = vec3(0.0, 1.0, 0.0);
      float borderSize = 5.0;

      vec3 p = wPos;
      vec3 sphereCenter = vCenter + vec3(-fSize * 0.2, -fSize * 0.3, fSize * 0.2);
      float sphereRadius = fSize * fReveal - borderSize * 2.0;

      float noiseDisplacement = fTime * 0.3;

      vec4 noisePosition = vec4(
        p.x / 20.0,
        (p.y - vCenter.y) / 20.0,
        p.z / 20.0,
        noiseDisplacement
      );

      float noiseFactor = noise4d1(noisePosition) * 10.0;
      float distance = length(sphereCenter - p) + noiseFactor;

      float sdf = distance - sphereRadius;
      float inside = clamp( -sdf / fwidth(sdf), 0., 1. );
      float border = clamp( (borderSize - sdf) / fwidth(sdf), 0., 1. );

      vec3 borderColor = vec3(1.,0.302,0.);
      
      vec3 result = mix(borderColor, gl_FragColor.rgb, inside);

      gl_FragColor.rgb = result;
      gl_FragColor.a = border;
    `
  })
}
