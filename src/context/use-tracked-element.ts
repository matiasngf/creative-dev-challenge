import { create } from 'zustand'

import type { Uniforms } from '~/hooks/use-uniforms'

export interface BaseTrackedElement<
  TrackedProps = unknown,
  TrackedUniforms = unknown
> {
  id: string
  group?: string
  props: TrackedProps extends object ? TrackedProps : undefined
  uniforms: TrackedUniforms
  /** If uniforms are defined, this will be typed */
  updateUniforms: TrackedUniforms extends Uniforms
    ? (uniforms: Partial<TrackedUniforms>) => void
    : undefined
  autoAdd?: boolean
}

export type WithRenderer<
  InputP,
  InputU,
  Tracker extends BaseTrackedElement<InputP, InputU>
> = Tracker & {
  renderer?: (props: Tracker) => JSX.Element
}

export type TrackedElement<
  TrackedProps extends object | unknown = unknown,
  TrackedUniforms extends object | unknown = unknown
> = WithRenderer<
  TrackedProps,
  TrackedUniforms,
  BaseTrackedElement<TrackedProps, TrackedUniforms>
>

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
