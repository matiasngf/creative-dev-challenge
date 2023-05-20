'use client'

import { useEffect } from 'react'

import { TrackedElement, useTrackerStore } from '~/context/use-tracked-element'
import type { Uniforms } from '~/hooks/use-uniforms'

export function ThreePortal<
  P extends object | unknown = unknown,
  U extends Uniforms | unknown = unknown
>({ id, group, props, uniforms, updateUniforms }: TrackedElement<P, U>) {
  const { trackElement, untrackElement, updateProps } = useTrackerStore(
    (s) => ({
      trackElement: s.trackElement,
      untrackElement: s.untrackElement,
      updateProps: s.updateProps
    })
  )

  useEffect(() => {
    trackElement({ id, group, props, uniforms, updateUniforms })
    return () => untrackElement(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, trackElement, untrackElement])

  useEffect(() => {
    updateProps(id, props)
  }, [id, props, updateProps])

  return null
}