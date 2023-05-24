# [< ShaderStandardMaterials](./README.md)

In order to apply custom shaders into `glb` models, we need to modify the `MeshStandardMaterial.onBeforeCompile` function. This was used to achieve the awwwards and cap reveals effects.

An example of this:

```tsx
const { nodes } = useGLTF('/models/awwwards.glb') as AwwardGLTF

const SceneNode = useMemo(() => {

  // Cerate a new group what will store our objects
  const Result = new Group()

  // Clone the origina scene
  const Scene = nodes.Awwwards.clone(true)
  Scene.traverse((child) => {
    if (
      child instanceof Mesh &&
      child.material instanceof MeshStandardMaterial
    ) {
        // clone object and material
        const newObject = child.clone(true)
        const newMaterial = newObject.material.clone() as MeshStandardMaterial

        // modify material with a custom compile function
        newMaterial.onBeforeCompile = compileAwwwardShader(uniforms)
        newMaterial.needsUpdate = true

        // important
        const randomId = Math.random().toString(36).substring(7)
        newMaterial.customProgramCacheKey = function () {
          return randomId
        }

        // add edited material to object
        newObject.material = newMaterial

        // add edited object to the group
        Result.add(newObject)
  })
  return Result
}, [nodes.Awwwards, uniforms])

return <primitive object={SceneNode} />
```

## How to compile a shader

The project has a special function called `buildCompile` that can be used to edit a `MeshStandardMaterial`.

[buildCompile source](../src/lib/standard-shader-material.ts)


Example usage:

```tsx
import { buildCompile } from '~/lib/standard-shader-material.ts'

export const compileAwwwardShader = (uniforms: Uniforms) => {
  return buildCompile({
    uniforms,
    vertexShaderBefore: /*glsl*/`
      // magic
    `,
    vertexShader: /*glsl*/`
      // magic
    `,
    fragmentShaderBefore: /*glsl*/`
      // magic
    `,
    fragmentShader: /*glsl*/`
      // magic
    `,
  })
```

Options:

```ts
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
```

Then, you can edit a material like this:

```tsx
const newObject = child.clone(true)
const newMaterial = newObject.material.clone() as MeshStandardMaterial
// modify material with a custom compile function
newMaterial.onBeforeCompile = compileAwwwardShader(uniforms)
```

## customProgramCacheKey

Because we are creating different compile functions, we want to tell Three.Js that each material shader is different and should be compiled separately.

We can do this by creating a random id and assigning it to the `customProgramCacheKey` function.

```tsx
const randomId = Math.random().toString(36).substring(7)
newMaterial.customProgramCacheKey = function () {
  return randomId
}
```