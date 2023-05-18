import Lenis from '@studio-freight/lenis'
import { useEffect } from 'react'

import { useScrollStore } from '~/context/use-scroll'

type LenisOptions = ConstructorParameters<typeof Lenis>[0]

export const useLenis = (options: LenisOptions = {}) => {
  const setYScroll = useScrollStore((state) => state.setYScroll)

  useEffect(() => {
    const lenis = new Lenis(options)

    const abortController = new AbortController()
    const signal = abortController.signal
    lenis.on('scroll', (e: any) => {
      setYScroll(e.animatedScroll)
    })

    const raf = (time: number) => {
      if (signal.aborted) return
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      abortController.abort()
    }
  }, [options, setYScroll])

  return
}
