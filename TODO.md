Automate store in a single component

```tsx
// uniform.tsx

interface Uniform<T = unknown> {
  value: T
}

interface Uniforms {
  [key: string]: Uniform
}

interface ComponentProps {
  [key: string]: unknown
}

// Cap.tsx
interface CapUniforms extends Uniforms {
  time: Uniform<number>
}

interface CapProps extends ComponentProps {
  rotate: number
}

type PortalProps<T extends unknown, K extends unknown> = {
  [key in keyof T]: T[key]
  uniforms: Uniforms
}

const ThreeCap = ({
  rotate,
  uniforms,
  updateUniforms,
  setProps
}: PortalProps<CapProps, CapUniforms>) => {
  // magic
  return (
    <mesh rotate={[0, rotate, 0]}>
      <boxBufferGeometry />
      <meshShaderMaterial uniforms={uniforms} />
    </mesh>
  )
}

const useHover = (ref) => {...}

// Ideal complex element
const Cap = () => {
  const elRef = useRef<HTMLDivElement | null>(null)
  const rect = useRect(elRef.current)
  const hover = useHover(elRef.current)

  //smooth values
  const smoothHover = useSmoothValue(+hover)

  const [capUniforms, updateUniforms] = useUniforms<CapUniforms>({
    fTime: 0,
    fHover: 0,
  })

  useEffect(() => {
    updateUniforms({
      fHover: 0,
    })
  }, [smoothHover])

  const [capProps, setCapProps] = useState<CapProps>({
    rotate: 0,
    rect
  })

  return (
    <div ref={elRef}>
      <ThreePortal
        element={ThreeCap}
        props={capProps}
        uniforms={capUniforms}
        updateUniforms={updateUniforms}
      />
    </div>

  )
}

```