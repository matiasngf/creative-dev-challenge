import { create } from 'zustand'

interface BaseTrackedElement {
  id: string
  group?: string
  uniforms?: {
    [key: string]: unknown
  }
}

export interface TrackedDiv extends BaseTrackedElement {
  type: 'div'
  el: HTMLDivElement
}

export interface TrackedImage extends BaseTrackedElement {
  type: 'image'
  el: HTMLImageElement
  autoAdd?: boolean
  fragmentShader?: string
  vertexShader?: string
}

export type TrackedHtml = TrackedDiv | TrackedImage

export interface ThreePortalStore {
  trackedElements: {
    [key: string]: TrackedHtml
  }
  trackElement: (element: TrackedHtml) => void
  untrackElement: (id: string) => void
  updateUniforms: (id: string, uniforms: TrackedHtml['uniforms']) => void
}

export const useTrackedStore = create<ThreePortalStore>((set) => ({
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
  updateUniforms: (id, uniforms) => {
    set((state) => {
      return {
        ...state,
        trackedElements: {
          ...state.trackedElements,
          [id]: {
            ...(state.trackedElements[id] as TrackedHtml),
            uniforms
          }
        }
      }
    })
  }
}))

export const useTrackedElement = <T extends TrackedHtml>(id: string) => {
  return useTrackedStore((s) => s.trackedElements[id]) as T | undefined
}

export const useTrackedGroup = <T extends TrackedHtml>(group: string) => {
  return useTrackedStore((s) => {
    return Object.values(s.trackedElements).filter(
      (el) => el.group === group
    ) as T[]
  })
}
