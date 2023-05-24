# [< ThreeImage](./README.md)

[Source](../src/components/common/three-image/index.tsx)

The `ThreeImage` component is a wrapper around the `Image` and `ThreePortal` components. It allows you to render an image in 3D space.

## Simple Usage

```tsx

import { myFragmentShader, myVertexShader } from './my-shaders'

<ThreeImage
  // common next/image props
  fill
  priority
  quality={100}
  src={url}

  // three-image props
  fragmentShader={myFragmentShader} // optional
  vertexShader={myVertexShader} // optional
/>
```

The default `fragmentShader`and `vertexShader` will render the image in the 3D space. You can provide your shaders to customize the look of the image.

## Writing custom image shaders

Some `uniforms` are provided to the image shader by default:

```glsl
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 wPos;

uniform vec2 vMousePos;
uniform float fHover;
uniform float fYScroll;
uniform vec2 vElementPos;
uniform vec2 vElementSize;
uniform sampler2D imageTexture;
uniform float fTime;
```

They can be imported on your shader as a constant:

```tsx
import { imageGlobals } from './lens-distortion'

const swapMapFragmentShader = /*glsl*/`
// add default uniforms
${imageGlobals}

// add your custom uniforms
uniform sampler2D hoverTexture;
uniform float fHoverSize;

void main() {
  // magic
}
`
```

_There are other shader utilities that ca be found on [lib/utils](../src/lib/utils/)._


I created the effects on this site on Shadertoy first to try them out:

* [Lens distortion, chromatic shift](https://www.shadertoy.com/view/DlV3DV)
* [Simple distance-based noise](https://www.shadertoy.com/view/cly3WV)

## Extra image maps

Other images can be loaded by using the `imageMaps` props, for example, if I want to create an image with a hover effect that reveals another image:

```tsx
<ThreeImage
  src={"/images/basement-team-2.jpg"}
  imageMaps={{
    hoverTexture: '/images/basement-team-2-hover.jpg'
  }}
/>
```

The default src is always the `imageTexture` uniform. The other images are loaded as textures and passed to the shader as uniforms. In this case, the `hoverTexture` uniform will be available on the shader.

## Custom image renderer

If you need custom uniforms or make a more complex image renderer, you can provide your own `renderer` function:

```tsx
import { PersistantNoiseReveal } from './my-renderer'

<ThreeImage
  src={image.url}
  renderer={PersistantNoiseReveal}
/>
```

In the [footer-gallery](../src/app/sections/footer-gallery/index.tsx) section, it uses the [PersistantNoiseReveal](../src/app/sections/footer-gallery/persistant-noise-reveal.tsx) renderer.

It uses the `ImageRendererElement` type from the [default-image-renderer](../src/components/common/three-image/default-image-renderer.tsx).