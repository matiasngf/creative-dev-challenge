import { create } from 'zustand'

export interface ScreenSizeStore {
  /** Width of the screen in px */
  width: number
  /** Height of the screen in px */
  height: number
  /** Pixel ratio of the screen */
  pixelRatio: number
  /** Set the width of the screen */
  setWidth: (width: number) => void
  /** Set the height of the screen */
  setHeight: (height: number) => void
  /** Set the pixel ratio of the screen */
  setPixelRatio: (pixelRatio: number) => void
  /** Function to update on frame */
  raf: () => void
}

export const useScreenSizeStore = create<ScreenSizeStore>((set) => ({
  width: 1920,
  height: 1080,
  pixelRatio: 1,
  setWidth: (width: number) => set({ width }),
  setHeight: (height: number) => set({ height }),
  setPixelRatio: (pixelRatio: number) => set({ pixelRatio }),
  raf: () => {
    set((state) => {
      const { innerWidth, innerHeight, devicePixelRatio } = window
      if (
        state.width === innerWidth &&
        state.height === innerHeight &&
        state.pixelRatio === devicePixelRatio
      ) {
        return {}
      }
      const width = innerWidth
      const height = innerHeight
      const pixelRatio = devicePixelRatio
      return {
        width,
        height,
        pixelRatio
      }
    })
  }
}))
