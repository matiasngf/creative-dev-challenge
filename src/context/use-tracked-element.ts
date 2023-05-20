import { create } from 'zustand'

export interface TrackerElementProps<
  TrackedProps = unknown,
  TrackedUniforms = unknown
> {
  id: string
  group?: string
  props: TrackedProps
  uniforms: TrackedUniforms
  autoAdd?: boolean
}

export type TrackerRenderer<
  InputP,
  InputU,
  Tracker = TrackerElementProps<InputP, InputU>
> = (props: Tracker) => JSX.Element

export interface TrackedElement<
  TrackedProps = unknown,
  TrackedUniforms = unknown
> extends TrackerElementProps<TrackedProps, TrackedUniforms> {
  renderer?: TrackerRenderer<TrackedProps, TrackedUniforms>
}

export interface ThreePortalStore {
  trackedElements: {
    [key: string]: TrackedElement
  }
  trackElement: <P = unknown, T = unknown>(
    element: TrackedElement<P, T>
  ) => void
  untrackElement: (id: string) => void
  updateProps: (id: string, props: TrackedElement['props']) => void
  updateRenderer: (id: string, renderer: TrackedElement['renderer']) => void
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
      } as any
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
  },
  updateRenderer: (id, renderer) => {
    set((state) => {
      return {
        ...state,
        trackedElements: {
          ...state.trackedElements,
          [id]: {
            ...(state.trackedElements[id] as TrackedElement),
            renderer
          }
        }
      }
    })
  }
}))
