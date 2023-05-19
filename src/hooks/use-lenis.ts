'use client'

import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'

import { useScrollStore } from '~/context/use-scroll'

type LenisOptions = ConstructorParameters<typeof Lenis>[0]

export const useLenis = (options: LenisOptions = {}) => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
  }, [])

  const setYScroll = useScrollStore((state) => state.setYScroll)

  const stringifyOptions = JSON.stringify(options)

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    const lenis = new Lenis(options)
    lenis.on('scroll', (e: any) => {
      ScrollTrigger.update()
      setYScroll(e.animatedScroll)
    })

    const raf: gsap.TickerCallback = (time) => {
      if (signal.aborted) return
      lenis.raf(time)
    }

    gsap.ticker.add(raf, false, true)

    return () => {
      abortController.abort()
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifyOptions, setYScroll])

  return
}
