import { imageGlobals } from './lens-distortion'
import { noiseMask } from './noise-mask'

export const swapMapFragmentShader = /* glsl */ `
${imageGlobals}
uniform sampler2D hoverTexture;
uniform float fHoverSize;

${noiseMask}

float grayscale(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

void main() {
  vec3 p = wPos;
  vec3 result = vec3(1.0);
  vec2 realMousePos = vMousePos + vec2(0.0, fYScroll);
  vec3 shereCenter = vec3(realMousePos, 0.0);
  
  vec4 noiseP = vec4(p, fTime);
  float noiseRadius = fHoverSize;
  float noiseScale = 2.0;
  float noiseVelociy = 0.2;
  float noiseAmplitude = 30.0;
  NoiseMask noise = getNoiseMask(
    noiseP,
    shereCenter,
    noiseRadius,
    noiseScale,
    noiseVelociy,
    noiseAmplitude
  );

  vec3 borderColor = vec3(1.,0.302,0.);
  float borderSize = 5.;

  float border = calcSdfInside(noise.sdf - borderSize);
  
  vec3 textureBase = texture2D(imageTexture, vUv).rgb;
  vec3 texureHover = texture2D(hoverTexture, vUv).rgb;

  result = mix(textureBase, borderColor, border);
  result = mix(result, texureHover, noise.inside);
  // result = vec3(noise.debug);

  gl_FragColor = vec4(result, 1.0);

}
`
