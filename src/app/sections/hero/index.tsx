'use client'

import React from 'react'
import Marquee from 'react-fast-marquee'

import { Container } from '~/components/layout/container'

import { AwwwardTracker } from './awwward'
import s from './hero.module.scss'

export const Hero = () => {
  return (
    <Container as="section" className={s.container}>
      <h1>
        Basement
        <span>LAB</span>
      </h1>
      <Marquee className={s.marquee} autoFill aria-label="Marquee section">
        <p>
          A man can't have enough basement swag — A man can't have enough
          basement swag
        </p>
      </Marquee>
      <div className={s.awwward}>
        <AwwwardTracker />
      </div>
    </Container>
  )
}
