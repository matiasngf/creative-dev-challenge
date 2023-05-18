import { create } from 'zustand'

export interface ScrollState {
  yScroll: number
  setYScroll: (yScroll: number) => void
}

export const useScrollStore = create<ScrollState>((set) => ({
  yScroll: 0,
  setYScroll: (yScroll) => set({ yScroll })
}))
