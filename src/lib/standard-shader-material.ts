import { extend } from '@react-three/fiber'
import {
  MeshStandardMaterial,
  MeshStandardMaterialParameters,
  Shader
} from 'three'

import type { Uniforms } from '~/hooks/use-uniforms'

interface ShaderStandardMaterialParameters
  extends MeshStandardMaterialParameters {
  uniforms?: Uniforms
  vertexShaderBefore?: string
  vertexShader?: string
  fragmentShaderBefore?: string
  fragmentShader?: string
  compileShader?: (shader: Shader) => void
}

export class StandardShaderMaterial extends MeshStandardMaterial {
  constructor({
    uniforms,
    vertexShaderBefore,
    vertexShader,
    fragmentShaderBefore,
    fragmentShader,
    compileShader,
    ...parameters
  }: ShaderStandardMaterialParameters) {
    super(parameters)
    this.onBeforeCompile = (shader) => {
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
}

extend({ StandardShaderMaterial })
