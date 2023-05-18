import { create } from 'zustand'

// Extend this store if you need!

export interface FontsState {
  fontsLoaded: boolean
  setFontsLoaded: (fontsLoaded: boolean) => void
}

export const useFontsStore = create<FontsState>((set) => ({
  fontsLoaded: false,
  setFontsLoaded: (fontsLoaded: boolean) => set((s) => ({ ...s, fontsLoaded }))
}))
