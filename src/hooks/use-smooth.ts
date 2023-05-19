import { useEffect, useRef, useState } from 'react'

export const useSmooth = (target: number, lerp = 0.1) => {
  const [state, setState] = useState(target)

  const stateRef = useRef(target)

  useEffect(() => {
    const abort = new AbortController()
    const signal = abort.signal
    const frame = () => {
      if (signal.aborted) return
      if (stateRef.current === target) return
      if (Math.abs(target - stateRef.current) < 0.001) {
        setState(target)
        stateRef.current = target
        return
      }
      stateRef.current = stateRef.current + (target - stateRef.current) * lerp
      setState(stateRef.current)
      requestAnimationFrame(frame)
    }
    frame()
    return () => abort.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, lerp])

  return state
}
