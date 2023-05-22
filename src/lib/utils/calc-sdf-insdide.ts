export const calcSdfInside = /* glsl */ `
float calcSdfInside(float sdf) {
  return clamp( -sdf / fwidth(sdf), 0., 1.);
}
`
