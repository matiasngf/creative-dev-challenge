import { useCallback, useEffect, useMemo, useRef } from 'react'

type Uniforms<T extends Input> = {
  [key in keyof T]: {
    value: T[key]
  }
}

interface Input {
  [key: string]: unknown
}

export const useUniforms = <T extends Input>(state: T) => {
  // create initial state
  const uniformsObject = useMemo(() => {
    const u = {} as Uniforms<T>
    Object.entries(state).forEach(([key, value]) => {
      ;(u as any)[key] = { value }
    })
    return u as Uniforms<T>
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // create ref
  const uniformsRef = useRef(uniformsObject)

  const updateUniforms = useCallback((state: Partial<T>) => {
    Object.entries(state).forEach(([key, value]) => {
      ;(uniformsRef.current as any)[key].value = value
    })
  }, [])

  // update ref
  useEffect(() => {
    updateUniforms(state)
  }, [state, updateUniforms])

  return [uniformsRef.current, updateUniforms] as const
}
