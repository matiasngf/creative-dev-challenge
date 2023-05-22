import { calcSdfInside } from './calc-sdf-insdide'
import { noise4d1 } from './shaders'

export const noiseMask = /* glsl */ `
${noise4d1}
${calcSdfInside}

struct NoiseMask {
  float sdf;
  float inside;
  float debug;
};

NoiseMask getNoiseMask(vec4 p,
  vec3 center,
  float radius,
  float noiseScale,
  float noiseVelociy,
  float noiseAmplitude
) {
  float noiseFactor = noise4d1(vec4(
    (p.xyz / 20.) / noiseScale,
    p.w * noiseVelociy
  )) * noiseAmplitude;
  
  float sdf = length(center - p.xyz);
  sdf -= radius;
  sdf += noiseFactor;
  float inside = calcSdfInside(sdf);

  float debug = 0.0;
  debug = inside;

  return NoiseMask(sdf, inside, debug);
}
`
