import { useState } from 'react'
import { create } from 'zustand'

import { Uniforms, useUniforms } from '~/hooks/use-uniforms'

export interface TrackedElement<P = unknown, U = unknown> {
  id: string
  group?: string
  uniforms?: Uniforms<U>
  props?: P
}

export interface ThreePortalStore {
  trackedElements: {
    [key: string]: TrackedElement
  }
  trackElement: (element: TrackedElement) => void
  untrackElement: (id: string) => void
  updateProps: (id: string, props: TrackedElement['props']) => void
}

export const useTrackerStore = create<ThreePortalStore>((set) => ({
  trackedElements: {},
  trackElement: (element) => {
    set((state) => {
      return {
        ...state,
        trackedElements: {
          ...state.trackedElements,
          [element.id]: element
        }
      }
    })
  },
  untrackElement: (id) => {
    set((state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [id]: _, ...rest } = state.trackedElements
      return {
        ...state,
        trackedElements: rest
      }
    })
  },
  updateProps: (id, props) => {
    set((state) => {
      return {
        ...state,
        trackedElements: {
          ...state.trackedElements,
          [id]: {
            ...(state.trackedElements[id] as TrackedElement),
            props
          }
        }
      }
    })
  }
}))

export interface UseTrackedElementOptions<
  InputProps extends object,
  InputUniforms extends Uniforms
> {
  id: string
  group?: string
  props?: InputProps
  uniforms?: InputUniforms
}

export const useTrackedElement = <
  InputProps extends object,
  InputUniforms extends object
>({
  props = {} as InputProps,
  uniforms = {} as InputUniforms
}: UseTrackedElementOptions<InputProps, InputUniforms>) => {
  const [cProps, setCProps] = useState(props)
  const [cUniforms, updateCUniforms] = useUniforms(uniforms)
  // TODO: use the store

  return {
    props: cProps,
    updateProps: setCProps,
    uniforms: cUniforms,
    updateUniforms: updateCUniforms
  }
}
