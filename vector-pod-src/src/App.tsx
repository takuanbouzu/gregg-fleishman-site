import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {
  Box,
  ChevronRight,
  Crosshair,
  Eye,
  EyeOff,
  Focus,
  Layers3,
  Pause,
  Play,
  Rotate3D,
  ScanLine,
  Sparkles,
  X,
} from 'lucide-react'
import { MODEL_DATA } from './modelData'
import { RHOMBIC_DODECA } from './rhombicDodeca'

type Mode = 'assembly' | 'exploded' | 'geometry'
type ViewPreset = 'perspective' | 'top' | 'front' | 'right'
type Category = 'assembly' | 'panels' | 'extension'

type PartData = {
  id: string
  sourceId: string
  sourceIndex: number
  category: Category
  layerIndex: number
  layerName: string
  groups: string[]
  instancePath: string[]
  faceCount: number
  edgeCount: number
  center: number[]
  dimensions: number[]
  quantum: number
  vertexCount: number
  positions: string
}

type ReferenceData = {
  layerName: string
  quantum: number
  vertexCount: number
  positions: string
}

type VisibilityState = {
  assembly: boolean
  panels: boolean
  extension: boolean
  rhombic: boolean
  axis: boolean
  cube: boolean
}

type Runtime = {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  controls: OrbitControls
  partObjects: Map<string, THREE.LineSegments>
  referenceObjects: Map<string, THREE.LineSegments>
  rhombicObject: THREE.LineSegments
  points: THREE.Points
  resizeObserver: ResizeObserver
  frame: number
  cameraGoal: THREE.Vector3 | null
}

const data = MODEL_DATA as {
  meta: {
    source: string
    archiveVersion: number
    originRhino: number[]
    storedObjectCount: number
    solidInstanceCount: number
    visibleSolidInstanceCount: number
    radius: number
    units: string
  }
  parts: PartData[]
  references: Record<string, ReferenceData>
  points: { layerIndex: number; position: number[] }[]
}

const palette = {
  assembly: new THREE.Color('#d9d5c9'),
  panels: new THREE.Color('#e0664b'),
  extension: new THREE.Color('#e9b85c'),
  selected: new THREE.Color('#f8f3df'),
  axis: new THREE.Color('#7ba98b'),
  cube: new THREE.Color('#55748c'),
  rhombic: new THREE.Color('#a99ac9'),
}

function decodePositions(encoded: string, quantum: number) {
  const binary = atob(encoded)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  const values = new Int16Array(bytes.buffer)
  const positions = new Float32Array(values.length)
  for (let index = 0; index < values.length; index += 1) {
    positions[index] = values[index] * quantum
  }
  return positions
}

function baseOpacity(category: Category, mode: Mode) {
  if (mode === 'geometry') return category === 'panels' ? 0.34 : 0.18
  if (category === 'panels') return 0.9
  if (category === 'extension') return 0.86
  return 0.56
}

function PodScene({
  mode,
  explode,
  visibility,
  autoRotate,
  selectedId,
  viewPreset,
  onSelect,
  onReady,
}: {
  mode: Mode
  explode: number
  visibility: VisibilityState
  autoRotate: boolean
  selectedId: string | null
  viewPreset: ViewPreset
  onSelect: (part: PartData | null) => void
  onReady: () => void
}) {
  const mountRef = useRef<HTMLDivElement>(null)
  const runtimeRef = useRef<Runtime | null>(null)
  const onSelectRef = useRef(onSelect)

  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#070a0b')
    scene.fog = new THREE.FogExp2('#070a0b', 0.00185)

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    mount.appendChild(renderer.domElement)

    const radius = Math.max(data.meta.radius, 150)
    const camera = new THREE.PerspectiveCamera(31, mount.clientWidth / mount.clientHeight, 0.1, 1500)
    camera.position.set(radius * 1.72, radius * 1.15, radius * 1.78)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.055
    controls.minDistance = 105
    controls.maxDistance = 690
    controls.autoRotateSpeed = 0.46
    controls.target.set(0, 0, 0)

    const modelRoot = new THREE.Group()
    scene.add(modelRoot)

    const partObjects = new Map<string, THREE.LineSegments>()
    data.parts.forEach((part) => {
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(decodePositions(part.positions, part.quantum), 3))
      geometry.computeBoundingSphere()
      const material = new THREE.LineBasicMaterial({
        color: palette[part.category],
        transparent: true,
        opacity: baseOpacity(part.category, 'assembly'),
        depthWrite: false,
      })
      const object = new THREE.LineSegments(geometry, material)
      const base = new THREE.Vector3(part.center[0], part.center[1], part.center[2])
      const direction = base.lengthSq() > 1 ? base.clone().normalize() : new THREE.Vector3(0, 1, 0)
      object.position.copy(base)
      object.userData = {
        part,
        base,
        direction,
        desired: base.clone(),
      }
      object.visible = part.category !== 'extension'
      modelRoot.add(object)
      partObjects.set(part.id, object)
    })

    const referenceObjects = new Map<string, THREE.LineSegments>()
    Object.entries(data.references).forEach(([layerIndex, reference]) => {
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(decodePositions(reference.positions, reference.quantum), 3))
      const isAxis = layerIndex === '2'
      const material = new THREE.LineBasicMaterial({
        color: isAxis ? palette.axis : palette.cube,
        transparent: true,
        opacity: isAxis ? 0.24 : 0.32,
        depthWrite: false,
      })
      const object = new THREE.LineSegments(geometry, material)
      object.visible = false
      scene.add(object)
      referenceObjects.set(layerIndex, object)
    })

    // Rhombic dodecahedron — the space-filling dual of Gregg's vector system,
    // baked as a feature-edge wireframe (see rhombicDodeca.ts). Toggled from the
    // part-system panel; centered at the origin like the cube-frame reference.
    const rhombicGeometry = new THREE.BufferGeometry()
    rhombicGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(decodePositions(RHOMBIC_DODECA.positions, RHOMBIC_DODECA.quantum), 3),
    )
    const rhombicObject = new THREE.LineSegments(
      rhombicGeometry,
      new THREE.LineBasicMaterial({ color: palette.rhombic, transparent: true, opacity: 0.7, depthWrite: false }),
    )
    rhombicObject.visible = false
    scene.add(rhombicObject)

    const pointPositions = new Float32Array(data.points.flatMap((point) => point.position))
    const pointGeometry = new THREE.BufferGeometry()
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3))
    const points = new THREE.Points(
      pointGeometry,
      new THREE.PointsMaterial({ color: '#dcd5bb', size: 2.6, sizeAttenuation: true }),
    )
    points.visible = false
    scene.add(points)

    const grid = new THREE.GridHelper(520, 20, '#263733', '#17211f')
    grid.position.y = -108
    const gridMaterial = grid.material as THREE.Material
    gridMaterial.transparent = true
    gridMaterial.opacity = 0.34
    scene.add(grid)

    const haloGeometry = new THREE.RingGeometry(119, 119.35, 128)
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: '#324a43',
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
    const halo = new THREE.Mesh(haloGeometry, haloMaterial)
    halo.rotation.x = -Math.PI / 2
    halo.position.y = -107.5
    scene.add(halo)

    const raycaster = new THREE.Raycaster()
    raycaster.params.Line = { threshold: 1.8 }
    const pointer = new THREE.Vector2()
    let pointerDown = { x: 0, y: 0 }

    const onPointerDown = (event: PointerEvent) => {
      pointerDown = { x: event.clientX, y: event.clientY }
      const runtime = runtimeRef.current
      if (runtime) runtime.cameraGoal = null
    }
    const onPointerUp = (event: PointerEvent) => {
      if (Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y) > 5) return
      const bounds = renderer.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const candidates = [...partObjects.values()].filter((object) => object.visible)
      const hit = raycaster.intersectObjects(candidates, false)[0]
      onSelectRef.current(hit ? (hit.object.userData.part as PartData) : null)
    }
    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    renderer.domElement.addEventListener('pointerup', onPointerUp)

    const resize = () => {
      if (!mount.clientWidth || !mount.clientHeight) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.fov = mount.clientWidth < 600 ? 38 : 31
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)

    const runtime: Runtime = {
      renderer,
      scene,
      camera,
      controls,
      partObjects,
      referenceObjects,
      rhombicObject,
      points,
      resizeObserver,
      frame: 0,
      cameraGoal: null,
    }
    runtimeRef.current = runtime

    const animate = () => {
      runtime.frame = requestAnimationFrame(animate)
      partObjects.forEach((object) => {
        object.position.lerp(object.userData.desired as THREE.Vector3, 0.085)
      })
      if (runtime.cameraGoal) {
        camera.position.lerp(runtime.cameraGoal, 0.075)
        if (camera.position.distanceTo(runtime.cameraGoal) < 0.35) runtime.cameraGoal = null
      }
      controls.update()
      renderer.render(scene, camera)
    }
    animate()
    onReady()

    return () => {
      cancelAnimationFrame(runtime.frame)
      resizeObserver.disconnect()
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      renderer.domElement.removeEventListener('pointerup', onPointerUp)
      controls.dispose()
      partObjects.forEach((object) => {
        object.geometry.dispose()
        ;(object.material as THREE.Material).dispose()
      })
      referenceObjects.forEach((object) => {
        object.geometry.dispose()
        ;(object.material as THREE.Material).dispose()
      })
      rhombicObject.geometry.dispose()
      ;(rhombicObject.material as THREE.Material).dispose()
      pointGeometry.dispose()
      ;(points.material as THREE.Material).dispose()
      haloGeometry.dispose()
      haloMaterial.dispose()
      renderer.dispose()
      renderer.domElement.remove()
      runtimeRef.current = null
    }
  }, [onReady])

  useEffect(() => {
    const runtime = runtimeRef.current
    if (!runtime) return
    runtime.controls.autoRotate = autoRotate
  }, [autoRotate])

  useEffect(() => {
    const runtime = runtimeRef.current
    if (!runtime) return
    runtime.partObjects.forEach((object) => {
      const part = object.userData.part as PartData
      const base = object.userData.base as THREE.Vector3
      const direction = object.userData.direction as THREE.Vector3
      const categoryBoost = part.category === 'panels' ? 1.12 : part.category === 'extension' ? 1.35 : 1
      const amount = mode === 'exploded' ? explode * 48 * categoryBoost : 0
      ;(object.userData.desired as THREE.Vector3).copy(base).addScaledVector(direction, amount)
    })
  }, [explode, mode])

  useEffect(() => {
    const runtime = runtimeRef.current
    if (!runtime) return
    runtime.partObjects.forEach((object) => {
      const part = object.userData.part as PartData
      object.visible = visibility[part.category]
      const material = object.material as THREE.LineBasicMaterial
      material.color.copy(part.id === selectedId ? palette.selected : palette[part.category])
      material.opacity = part.id === selectedId ? 1 : baseOpacity(part.category, mode)
      object.renderOrder = part.id === selectedId ? 10 : 0
    })
    const axis = runtime.referenceObjects.get('2')
    const cube = runtime.referenceObjects.get('3')
    if (axis) {
      axis.visible = visibility.axis
      ;(axis.material as THREE.LineBasicMaterial).opacity = mode === 'geometry' ? 0.48 : 0.22
    }
    if (cube) {
      cube.visible = visibility.cube
      ;(cube.material as THREE.LineBasicMaterial).opacity = mode === 'geometry' ? 0.62 : 0.3
    }
    runtime.rhombicObject.visible = visibility.rhombic
    ;(runtime.rhombicObject.material as THREE.LineBasicMaterial).opacity = mode === 'geometry' ? 0.82 : 0.62
    runtime.points.visible = visibility.axis
  }, [mode, selectedId, visibility])

  useEffect(() => {
    const runtime = runtimeRef.current
    if (!runtime) return
    const radius = Math.max(data.meta.radius, 150)
    const viewportWidth = mountRef.current?.clientWidth ?? window.innerWidth
    const viewportScale = viewportWidth < 600 ? 1.48 : viewportWidth < 820 ? 1.16 : 1
    const viewScale = (mode === 'exploded' ? 1 + explode * 0.32 : 1) * viewportScale
    const destinations: Record<ViewPreset, THREE.Vector3> = {
      perspective: new THREE.Vector3(radius * 1.72 * viewScale, radius * 1.15 * viewScale, radius * 1.78 * viewScale),
      top: new THREE.Vector3(0.01, radius * 2.55 * viewScale, 0.01),
      front: new THREE.Vector3(0, 0, radius * 2.55 * viewScale),
      right: new THREE.Vector3(radius * 2.55 * viewScale, 0, 0.01),
    }
    runtime.camera.up.set(0, 1, 0)
    if (viewPreset === 'top') runtime.camera.up.set(0, 0, -1)
    runtime.cameraGoal = destinations[viewPreset]
    runtime.controls.target.set(0, 0, 0)
  }, [explode, mode, viewPreset])

  return <div className="scene-mount" ref={mountRef} aria-label="Interactive 3D model of the Vector Pod" />
}

function ToggleRow({
  label,
  detail,
  active,
  color,
  onClick,
}: {
  label: string
  detail: string
  active: boolean
  color: string
  onClick: () => void
}) {
  return (
    <button className="toggle-row" type="button" aria-pressed={active} onClick={onClick}>
      <span className="swatch" style={{ backgroundColor: color }} />
      <span className="toggle-copy">
        <strong>{label}</strong>
        <small>{detail}</small>
      </span>
      {active ? <Eye size={15} /> : <EyeOff size={15} />}
    </button>
  )
}

function App() {
  const [mode, setMode] = useState<Mode>('assembly')
  const [explode, setExplode] = useState(0.66)
  const [autoRotate, setAutoRotate] = useState(true)
  const [selected, setSelected] = useState<PartData | null>(null)
  const [viewPreset, setViewPreset] = useState<ViewPreset>('perspective')
  const [ready, setReady] = useState(false)
  const [visibility, setVisibility] = useState<VisibilityState>({
    assembly: true,
    panels: true,
    extension: false,
    rhombic: false,
    axis: false,
    cube: false,
  })

  const stableReady = useMemo(() => () => setReady(true), [])

  const chooseMode = (nextMode: Mode) => {
    setMode(nextMode)
    setSelected(null)
    if (nextMode === 'geometry') {
      setVisibility((current) => ({ ...current, axis: true, cube: true }))
      setAutoRotate(false)
    }
    if (nextMode === 'assembly') {
      setVisibility((current) => ({ ...current, axis: false, cube: false }))
    }
  }

  const toggle = (key: keyof VisibilityState) => {
    setVisibility((current) => ({ ...current, [key]: !current[key] }))
  }

  return (
    <main className="app-shell">
      <PodScene
        mode={mode}
        explode={explode}
        visibility={visibility}
        autoRotate={autoRotate}
        selectedId={selected?.id ?? null}
        viewPreset={viewPreset}
        onSelect={setSelected}
        onReady={stableReady}
      />

      <div className="ambient-grain" aria-hidden="true" />

      <header className="masthead">
        <div className="project-mark">
          <span className="mark-line" />
          <span>GREGG FLEISHMAN / CURRENT EXPLORATION</span>
        </div>
        <h1>VECTOR POD</h1>
        <p>Interactive part study · unpublished · 2026</p>
      </header>

      <section className="mode-rail" aria-label="Display mode">
        <p className="panel-label">MODE</p>
        {([
          ['assembly', Box, 'Assembled'],
          ['exploded', Sparkles, 'Exploded'],
          ['geometry', ScanLine, 'Geometry'],
        ] as const).map(([value, Icon, label], index) => (
          <button
            key={value}
            type="button"
            className={`mode-button ${mode === value ? 'active' : ''}`}
            onClick={() => chooseMode(value)}
          >
            <span className="mode-index">0{index + 1}</span>
            <Icon size={17} />
            <span>{label}</span>
            <ChevronRight size={15} />
          </button>
        ))}

        <div className={`explode-control ${mode === 'exploded' ? 'enabled' : ''}`}>
          <div className="range-heading">
            <span>SEPARATION</span>
            <strong>{Math.round(explode * 100)}%</strong>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={explode}
            disabled={mode !== 'exploded'}
            onChange={(event) => setExplode(Number(event.target.value))}
            aria-label="Exploded view separation"
          />
        </div>
      </section>

      <section className={`layer-panel ${selected ? 'behind-inspector' : ''}`} aria-label="Model layers">
        <div className="panel-heading">
          <div>
            <p className="panel-label">PART SYSTEM</p>
            <h2>Layer visibility</h2>
          </div>
          <Layers3 size={18} />
        </div>
        <ToggleRow
          label="Assembly"
          detail="188 structural parts"
          active={visibility.assembly}
          color="#d9d5c9"
          onClick={() => toggle('assembly')}
        />
        <ToggleRow
          label="Panels"
          detail="19 highlighted parts"
          active={visibility.panels}
          color="#e0664b"
          onClick={() => toggle('panels')}
        />
        <ToggleRow
          label="Extension"
          detail="26 hidden-option parts"
          active={visibility.extension}
          color="#e9b85c"
          onClick={() => toggle('extension')}
        />
        <ToggleRow
          label="Rhombic dodeca"
          detail="space-filling dual overlay"
          active={visibility.rhombic}
          color="#a99ac9"
          onClick={() => toggle('rhombic')}
        />
        <div className="section-rule" />
        <ToggleRow
          label="Axis reference"
          detail="45° and 54.74° lines"
          active={visibility.axis}
          color="#7ba98b"
          onClick={() => toggle('axis')}
        />
        <ToggleRow
          label="Cube frame"
          detail="191.3-unit reference"
          active={visibility.cube}
          color="#55748c"
          onClick={() => toggle('cube')}
        />
      </section>

      <nav className="view-dock" aria-label="Camera views">
        {(['perspective', 'top', 'front', 'right'] as ViewPreset[]).map((view) => (
          <button
            key={view}
            type="button"
            className={viewPreset === view ? 'active' : ''}
            onClick={() => setViewPreset(view)}
          >
            {view === 'perspective' && <Rotate3D size={15} />}
            {view === 'top' && <Crosshair size={15} />}
            {view === 'front' && <Focus size={15} />}
            {view === 'right' && <Box size={15} />}
            <span>{view}</span>
          </button>
        ))}
        <span className="dock-rule" />
        <button type="button" className={autoRotate ? 'active' : ''} onClick={() => setAutoRotate(!autoRotate)}>
          {autoRotate ? <Pause size={15} /> : <Play size={15} />}
          <span>{autoRotate ? 'pause' : 'rotate'}</span>
        </button>
      </nav>

      {selected && (
        <aside className="part-inspector">
          <button className="inspector-close" type="button" onClick={() => setSelected(null)} aria-label="Close part details">
            <X size={15} />
          </button>
          <p className="panel-label">SELECTED PART</p>
          <h2>{selected.id.toUpperCase()}</h2>
          <div className="part-category">
            <span className="swatch" style={{ backgroundColor: `#${selected.category === 'panels' ? 'e0664b' : selected.category === 'extension' ? 'e9b85c' : 'd9d5c9'}` }} />
            {selected.layerName}
          </div>
          <dl>
            <div>
              <dt>Faces</dt>
              <dd>{selected.faceCount}</dd>
            </div>
            <div>
              <dt>Edges</dt>
              <dd>{selected.edgeCount}</dd>
            </div>
            <div>
              <dt>Envelope</dt>
              <dd>{selected.dimensions.map((value) => value.toFixed(2)).join(' × ')}</dd>
            </div>
            <div>
              <dt>Group</dt>
              <dd>{selected.groups.join(', ') || 'Ungrouped'}</dd>
            </div>
            <div>
              <dt>Block path</dt>
              <dd>{selected.instancePath.join(' / ') || 'Direct object'}</dd>
            </div>
          </dl>
        </aside>
      )}

      <footer className="status-bar">
        <span className={`status-dot ${ready ? 'ready' : ''}`} />
        <span>{ready ? `${data.meta.visibleSolidInstanceCount} active parts` : 'constructing model'}</span>
        <span className="status-rule" />
        <span>drag to orbit</span>
        <span>scroll to zoom</span>
        <span>click a part to inspect</span>
        <span className="source-note">SOURCE · {data.meta.source}</span>
      </footer>

      {!ready && (
        <div className="loading-screen">
          <span className="loading-mark" />
          <p>ASSEMBLING 233 PARTS</p>
        </div>
      )}
    </main>
  )
}

export default App
