/** vec2 calculateUV(vec2 mousePos, vec2 elementPos, vec2 elementSize) */
export const calculateUv = /* glsl */ `
vec2 calculateUV(vec2 mousePos, vec2 elementPos, vec2 elementSize) {
  vec2 relativeMousePos = mousePos - elementPos;
  vec2 uv = relativeMousePos / elementSize;
  
  return uv;
}
`

/**
vec2 getDistortedUv(vec2 uv, vec2 direction, float factor)

struct DistortedLens {
  vec2 uv_R;
  vec2 uv_G;
  vec2 uv_B;
  float focusSdf;
  float speherSdf;
  float inside;
};

DistortedLens getLensDistortion(
  vec2 p,
  vec2 uv,
  vec2 sphereCenter,
  float sphereRadius,
  float focusFactor,
  float chromaticAberrationFactor
)
 */
export const getLensDistortion = /* glsl */ `
vec2 getDistortedUv(vec2 uv, vec2 direction, float factor) {
  return uv - direction * factor;
}

struct DistortedLens {
  vec2 uv_R;
  vec2 uv_G;
  vec2 uv_B;
  float focusSdf;
  float speherSdf;
  float inside;
  float debug;
};

DistortedLens getLensDistortion(
  vec2 p,
  vec2 uv,
  vec2 sphereCenter,
  float sphereRadius,
  float focusFactor,
  float chromaticAberrationFactor
) {
  vec2 distortionDirection = normalize(p - sphereCenter);

  float focusRadius = sphereRadius * focusFactor;
  float focusStrength = sphereRadius / 2000.0;

  float focusSdf = length(sphereCenter - p) - focusRadius;
  float speherSdf = length(sphereCenter - p) - sphereRadius;
  float inside = clamp( -speherSdf / fwidth(speherSdf), 0., 1.);
  
  float magnifierFactor = focusSdf / (sphereRadius - focusRadius);
    
  float mFactor = clamp(magnifierFactor * inside, 0., 1.);
  mFactor = pow(mFactor, 4.0);

  vec3 distortionFactors = vec3(
    mFactor * focusStrength * (1.0 + chromaticAberrationFactor),
    mFactor * focusStrength,
    mFactor * focusStrength * (1.0 - chromaticAberrationFactor)
  );
  vec2 uv_R = getDistortedUv(uv, distortionDirection, distortionFactors.r);
  vec2 uv_G = getDistortedUv(uv, distortionDirection, distortionFactors.g);
  vec2 uv_B = getDistortedUv(uv, distortionDirection, distortionFactors.g);

  float debug = 0.0;

  return DistortedLens(
    uv_R,
    uv_G,
    uv_B,
    focusSdf,
    speherSdf,
    inside,
    debug
  );
}
`
/** vec2 zoomUV(vec2 uv, vec2 center, float zoom) */
export const zoomUv = /* glsl */ `
vec2 zoomUV(vec2 uv, vec2 center, float zoom) {
  float zoomFactor = 1.0 / zoom;
  vec2 centeredUV = uv - center;
  centeredUV *= zoomFactor;
  return centeredUV + center;
}
`

export const imageDistortionFragment = /* glsl */ `
// based on https://www.shadertoy.com/view/DlV3DV

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 wPos;

uniform vec2 vMousePos;
uniform float fHover;
uniform float fYScroll;
uniform vec2 vElementPos;
uniform vec2 vElementSize;
uniform sampler2D imageTexture;

${zoomUv}
${getLensDistortion}
${calculateUv}

void main() {
  vec2 p = wPos.xy;
  vec3 result = vec3(1.0);

  vec2 sphereCenter = vMousePos + vec2(0.0, fYScroll);
  vec2 spehereCenterUv = calculateUV(
    vMousePos, vElementPos - vec2(0.0, fYScroll), vElementSize);

  float sphereRadius = 170.0;
  float focusFactor = 0.3;
  float chromaticAberrationFactor = 0.1;

  float zoom = 1.2;
  vec2 zoomedUv = zoomUV(
      vUv, spehereCenterUv, zoom
  );

  DistortedLens distortion = getLensDistortion(
    p,
    zoomedUv,
    sphereCenter,
    sphereRadius,
    focusFactor,
    chromaticAberrationFactor
  );
  
  float imageDistorted_R = texture2D(imageTexture, distortion.uv_R).x;
  float imageDistorted_G = texture2D(imageTexture, distortion.uv_G).y;
  float imageDistorted_B = texture2D(imageTexture, distortion.uv_B).z;

  vec3 imageDistorted = vec3(
      imageDistorted_R,
      imageDistorted_G,
      imageDistorted_B
  );
  vec3 image = texture2D(imageTexture, vUv).xyz;
  
  image = mix(image, imageDistorted, distortion.inside);


  result = vec3(image);

  // Output to screen
  gl_FragColor = vec4(result, 1.0);
}
`
