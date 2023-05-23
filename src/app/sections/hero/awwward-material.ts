import type { Uniforms } from '~/hooks/use-uniforms'
import { buildCompile } from '~/lib/standard-shader-material'
import { calcSdfInside } from '~/lib/utils/calc-sdf-insdide'
import { noise4d1 } from '~/lib/utils/shaders'
import { valueRemap } from '~/lib/utils/value-remap'

export const compileAwwwardShader = (uniforms: Uniforms) => {
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
      uniform float fHover;
      uniform float fTime;
      uniform float fSize;
      uniform vec3 vCenter;
      uniform vec2 vPos;

      varying vec3 wPos;

      ${noise4d1}
      ${valueRemap}
      ${calcSdfInside}
    `,
    fragmentShader: /*glsl*/ `
    float topPos = vPos.x + 40.;
    float bottomPos = vPos.y - 40.;
    
    vec3 result = gl_FragColor.rgb;
    vec3 p = wPos;

    float revealMaskY = valueRemap(fReveal, 0., 1., bottomPos, topPos);

    float noise = noise4d1(vec4(
      p.xyz / 40.0,
      0.0
    )) * 10.0;

    float sdf = p.y - revealMaskY + noise;
    float border = sdf - 5.0;

    float inside = calcSdfInside(sdf);
    float insideBorder = calcSdfInside(border);
    vec3 orangeColor = vec3(1.,0.302,0.);

    result = mix(orangeColor, result, inside);
    result = mix(result, orangeColor, fHover);
    
    gl_FragColor.rgb = result;
    gl_FragColor.a = insideBorder;
    `
  })
}
