import type { Shader } from 'three'

import type { Uniforms } from '~/hooks/use-uniforms'

export interface CompileOptions {
  /**Extra uniforms provided to the shader */
  uniforms?: Uniforms
  /**Code to be injected before the vertex shader's main function */
  vertexShaderBefore?: string
  /**Code to be injected inside the vertex shader's main function */
  vertexShader?: string
  /**Code to be injected before the fragment shader's main function */
  fragmentShaderBefore?: string
  /**Code to be injected inside the fragment shader's main function */
  fragmentShader?: string
  /**A custom function to modify the shader */
  compileShader?: (shader: Shader) => void
}

export function buildCompile({
  uniforms,
  vertexShaderBefore,
  vertexShader,
  fragmentShaderBefore,
  fragmentShader,
  compileShader
}: CompileOptions) {
  return function compile(shader: Shader) {
    if (uniforms) {
      Object.entries(uniforms).forEach(([key, value]) => {
        shader.uniforms[key] = value
      })
    }
    if (vertexShaderBefore) {
      shader.vertexShader = shader.vertexShader.replace(
        'void main() {',
        `${vertexShaderBefore}\nvoid main() {`
      )
    }
    if (vertexShader) {
      shader.vertexShader = shader.vertexShader.replace(
        'vWorldPosition = worldPosition.xyz;\n#endif',
        `vWorldPosition = worldPosition.xyz;\n#endif\n${vertexShader}`
      )
    }
    if (fragmentShaderBefore) {
      shader.fragmentShader = shader.fragmentShader.replace(
        'void main() {',
        `${fragmentShaderBefore}\nvoid main() {`
      )
    }
    if (fragmentShader) {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `#include <dithering_fragment>\n${fragmentShader}`
      )
    }
    if (typeof compileShader === 'function') compileShader(shader)
  }
}
