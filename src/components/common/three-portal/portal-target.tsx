'use client'

import { shallow } from 'zustand/shallow'

import { useTrackerStore } from '~/context/use-tracked-element'

/** Renders all elements with autoAdd on */
export const PortalTargetContainer = () => {
  const trackedElementsIds = useTrackerStore((s) => {
    const autoTrackers = Object.values(s.trackedElements).filter(
      (trElement) => trElement.autoAdd
    )
    return autoTrackers.map((trElement) => trElement.id)
  }, shallow)

  return (
    <>
      {trackedElementsIds.map((id) => (
        <PortalTarget id={id} key={id} />
      ))}
    </>
  )
}

/** Renders each autoAdded element */
const PortalTarget = ({ id }: { id: string }) => {
  const trackedElement = useTrackerStore((s) => s.trackedElements[id], shallow)

  if (!trackedElement) return null

  const { group, props, uniforms, renderer: Renderer } = trackedElement

  if (!Renderer) return null

  return <Renderer id={id} group={group} props={props} uniforms={uniforms} />
}
