> Tracks DOM elements and draws Three.js objects in their place using the correct scale and position (for images and models).

To correctly track DOM objects in the HTML, the `useClientRect` hook can be used to know the absolute position of any DOM element on the page.

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

_The absoluteTop and absoluteLeft is calculating using the `useScrollStore`._

```tsx