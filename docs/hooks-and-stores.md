# [< Hooks and stores](./README.md)

## useUniforms

[Source](../src/hooks/use-uniforms.ts)

An easy way to create and update uniforms.

```tsx
interface AwwwardUniforms {
  fHover: number
}

const [uniforms, updateUniforms] = useUniforms<AwwwardUniforms>({
  fHover: 0
})
```

## useClientRect

[Source](../src/hooks/use-client-rect.ts)

To correctly track DOM position in Three.js, the `useClientRect` hook can be used to know the absolute position of any DOM element on the page. Then, it can be passed down to the Three.js element as a prop.

```tsx
const rect = useClientRect(domElement)
```

It will return the following object:

```tsx
{
  // from the top of the screen
  top: number
  // from the left of the screen
  left: number
  // width of the element
  width: number
  // height of the element
  height: number
  // px of distance from the absolute top of the page (body start)
  absoluteTop: number
  // px of distance from the absolute left of the page (body start)
  absoluteLeft: number
}
```

_The absoluteTop and absoluteLeft are calculated using the `useScrollStore`._

## useMouseStore

[Source](../src/context/use-mouse.ts)

A hook to track the mouse position on the screen.

```tsx
const {
  /** X position in px relative to screen */
  x,
  /** Y position in px relative to screen */
  y,
  /** Whether the mouse is hovering something on the screen */
  hover,
  /** Element Ids that are hovered */
  hoveredElements,
  /** Reference to the mouse position */
  ref,
  /** Size of the cursor */
  size,
  /** Set the mouse position */
  setPosition,
  /** Register hovered element */
  registerHoveredElement,
  /** Remove hovered element */
  removeHoveredElement,
  /** Function to update on frame */
  raf,
} = useMouseStore()
```

## useRegisterHover

[Source](../src/context/use-mouse.ts)

This hook registers a hover event and makes any hover effect bigger by setting the `size` prop.

```tsx
const { registerHoveredElement, removeHoveredElement } = useRegisterHover()
return (
  <div
    onMouseEnter={registerHoveredElement}
    onMouseLeave={removeHoveredElement}
  >
    <ThreePortal ... />
  </div>
)
```

Then, the cursor size can be consumed like this:

```tsx
const hoverSize = useMouseStore((s) => s.size)
const canvasWidth = useScreenSizeStore((s) => s.width)

const scaledHoverSize = (canvasWidth / 1920) * hoverSize

useEffect(() => {
  updateUniforms({
    fHoverSize: scaledHoverSize
  })
}, [scaledHoverSize, updateUniforms])
```

## useScrollStore

[Source](../src/context/use-scroll.ts)

```tsx
const { yScroll, yScrollRef } = useScrollStore();
```

`yScroll`, the current scroll position. It will re-render the component every time it changes.

`yScrollRef`, a ref that can be used to get the current scroll position without re-rendering the component (useful for uniforms).


## useScreenSizeStore

[Source](../src/context/use-screen-size.ts)

```tsx
const {
  /** Width of the screen in px */
  width,
  /** Height of the screen in px */
  height,
  /** Pixel ratio of the screen */
  pixelRatio,
  /** Set the width of the screen */
  setWidth,
  /** Set the height of the screen */
  setHeight,
  /** Set the pixel ratio of the screen */
  setPixelRatio,
  /** Function to update on frame */
  raf,
} = useScreenSizeStore();
```


The raf function is used in the `useTrackMouseAndScreen` hook.

## useTrackMouseAndScreen

[Source](../src/context/use-mouse.ts)

When used, it re-runs on every frame to update the position of the mouse and screen size.

## useSmooth

[Source](../src/hooks/use-smooth.ts)

This hook is used to smooth a value over time.

```tsx
const [hover, setHover] = useState(0)
const smoothHover = useSmooth(hover, 0.1)

useEffect(() => {
  updateUniforms({
    fHover: smoothHover
  })
}, [smoothHover, updateUniforms])
```

## useTrackerStore

[Source](../src/context/use-tracked-element.ts)

The main store used to track HTML elements into Three.js.

Usually, it is only used via the `ThreePortal` component, but you can manually connect a DOM element to Three.js.

```tsx
const {
  trackedElements,
  trackElement,
  untrackElement,
  updateProps,
  updateRenderer,
} = useTrackerStore()

const {
  id,
  group,
  props,
  uniforms,
  autoAdd,
  renderer
} = trackedElements['some-id']
```

Rendering elements:

```tsx
import { shallow } from 'zustand/shallow'

const {
  props,
  uniforms,
  renderer: Renderer
} = useTrackerStore((s) => s.trackedElements['some-id'] || {}, shallow)

if(!Renderer) return null

return (
  <Renderer
    props={props}
    uniforms={uniforms}
  />
)
```