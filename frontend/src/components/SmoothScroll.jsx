import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }) {
  useEffect(() => {
    try {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      })

      function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }

      requestAnimationFrame(raf)

      // Connect Lenis with GSAP ScrollTrigger
      if (lenis && lenis.on) {
        lenis.on('scroll', ScrollTrigger.update)
      }

      if (gsap && gsap.ticker) {
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000)
        })
        gsap.ticker.lagSmoothing(0)
      }

      return () => {
        if (lenis && lenis.destroy) {
          lenis.destroy()
        }
      }
    } catch (error) {
      console.error('SmoothScroll error:', error)
    }
  }, [])

  return <>{children}</>
}

