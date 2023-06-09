'use client'

import { useEffect, useId } from 'react'

import { TrackedElement, useTrackerStore } from '~/context/use-tracked-element'

export type ThreePortalProps<P, U> = Omit<
  TrackedElement<P, U>,
  'props' | 'uniforms' | 'id'
> & {
  id?: string
  uniforms?: U
  props: P
  children?: TrackedElement<P, U>['renderer']
}

export function ThreePortal<P = unknown, U = unknown>({
  id: idInput,
  group,
  props,
  uniforms,
  autoAdd,
  renderer,
  children
}: ThreePortalProps<P, U>) {
  const generatedId = useId()
  const id = typeof idInput === 'string' ? idInput : generatedId

  const { trackElement, untrackElement, updateProps, updateRenderer } =
    useTrackerStore((s) => ({
      trackElement: s.trackElement,
      untrackElement: s.untrackElement,
      updateProps: s.updateProps,
      updateRenderer: s.updateRenderer
    }))

  const portalRenderer = renderer || children

  useEffect(() => {
    trackElement<P, U>({
      id,
      group,
      props: props as P,
      uniforms: uniforms as U,
      autoAdd,
      renderer: portalRenderer
    })
    return () => untrackElement(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, trackElement, untrackElement])

  useEffect(() => {
    updateProps(id, props)
  }, [id, props, updateProps])

  useEffect(() => {
    updateRenderer(id, portalRenderer as any)
  }, [id, portalRenderer, updateRenderer])

  return null
}
