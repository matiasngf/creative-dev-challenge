/**
float valueRemap(float value, float min, float max, float newMin, float newMax)
*/
export const valueRemap = /*glsl*/ `
  float valueRemap(float value, float min, float max, float newMin, float newMax) {
    return newMin + (newMax - newMin) * (value - min) / (max - min);
  }
` as string
