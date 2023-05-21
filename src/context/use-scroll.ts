import { create } from 'zustand'

export interface ScrollState {
  yScroll: number
  setYScroll: (yScroll: number) => void
  yScrollRef: ScrollRef
}

class ScrollRef {
  current = 0
}

export const useScrollStore = create<ScrollState>((set) => ({
  yScroll: 0,
  yScrollRef: new ScrollRef(),
  setYScroll: (yScroll) => {
    set((state) => {
      state.yScrollRef.current = yScroll
      return { yScroll }
    })
  }
}))
