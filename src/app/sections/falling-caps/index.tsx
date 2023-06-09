'use client'

import { gsap } from 'gsap'
import Image from 'next/image'
import React, { CSSProperties, useEffect, useRef } from 'react'

import { Container } from '~/components/layout/container'

import s from './caps.module.scss'
import { CapTracker } from './three-caps'

export interface Cap {
  left?: string
  top?: string
  right?: string
  bottom?: string
  /** Scale (of 509px)*/
  scale: number
  /** Rotation in degrees */
  rotate: number
}

const caps: Cap[] = [
  {
    rotate: -25,
    scale: 0.85,
    top: '7%',
    left: '3%'
  },
  {
    rotate: -22,
    scale: 0.75,
    top: '18%',
    right: '12%'
  },
  {
    rotate: -28,
    scale: 0.55,
    bottom: '18%',
    right: '35%'
  },
  {
    rotate: 22,
    scale: 0.65,
    top: '2%',
    right: '2%'
  },
  {
    rotate: 22,
    scale: 1,
    top: '10%',
    left: '35%'
  },
  {
    rotate: 27,
    scale: 0.7,
    bottom: '7%',
    left: '1%'
  },
  {
    rotate: 22,
    scale: 0.72,
    bottom: '1%',
    left: '18%'
  },
  {
    rotate: -8,
    scale: 0.85,
    bottom: '1%',
    right: '1%'
  }
]

export const FallingCaps = () => {
  const cssCaps: CSSProperties[] = [
    {
      transform: 'translate(0, 0) scale(0.85) rotate(-25deg)',
      top: '7%',
      left: '3%'
    },
    {
      transform: 'translate(0, 0) scale(0.75) rotate(-22deg)',
      top: '18%',
      right: '12%'
    },
    {
      transform: 'translate(0, 0) scale(0.55) rotate(-28deg)',
      bottom: '18%',
      right: '35%'
    },
    {
      transform: 'translate(0, 0) scale(0.65) rotate(22deg)',
      top: '2%',
      right: '2%'
    },
    {
      transform: 'translate(0, 0) rotate(22deg)',
      top: '10%',
      left: '35%'
    },
    {
      transform: 'translate(0, 0) scale(0.7) rotate(27deg)',
      bottom: '7%',
      left: '1%'
    },
    {
      transform: 'translate(0, 0) scale(0.72) rotate(22deg)',
      bottom: '1%',
      left: '18%'
    },
    {
      transform: 'translate(0, 0) scale(0.85) rotate(-8deg)',
      bottom: '1%',
      right: '1%'
    }
  ]

  const containerRef = useRef<HTMLDivElement>(null)

  const h2Ref = useRef<HTMLHeadingElement>(null)
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!h2Ref.current) return
    if (!spanRef.current) return
    if (!containerRef.current) return

    const triggerEl = document.getElementById('#capsContainer')

    const numOfScreens = 4
    const start = 100 / numOfScreens

    const t = gsap.to(h2Ref.current.style, {
      opacity: 1,
      duration: 1,
      scrollTrigger: {
        trigger: triggerEl,
        // element, screen
        start: start + '% bottom'
      }
    })
    const t2 = gsap.to(spanRef.current.style, {
      opacity: 1,
      duration: 1,
      scrollTrigger: {
        trigger: triggerEl,
        start: start + 20 + '% bottom'
      }
    })

    return () => {
      t.kill()
      t2.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [h2Ref.current, spanRef.current, containerRef.current])

  return (
    <div id="#capsContainer" className={s.scrollContainer} ref={containerRef}>
      <Container className={s.container}>
        <h2 ref={h2Ref} style={{ opacity: 0 }}>
          We want to help make <br />
          the internet <br />
          <span ref={spanRef} style={{ opacity: 0 }}>
            everything it can be.
          </span>
        </h2>
        {cssCaps.map((style, index) => (
          <Image
            alt="Cap"
            className={s.cap}
            height={509}
            key={index}
            quality={100}
            src="/assets/Cap.png"
            style={{ ...style, opacity: 0 }}
            width={509}
          />
        ))}
        {caps.map((cap, index) => (
          <CapTracker key={index} cap={cap} isFirst={index === 0} />
        ))}
      </Container>
    </div>
  )
}
