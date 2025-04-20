// ModelViewer.jsx — возвращены кнопки смены режима рисования и вращения
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import styles from './ModelViewer.module.css'

const Painter = ({ targetName, texture, brushColor, active }) => {
  const { camera, gl, scene } = useThree()
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  const [startUV, setStartUV] = useState(null)
  const [hoverUV, setHoverUV] = useState(null)
  const meshRef = useRef(null)

  useEffect(() => {
    if (!active) return
    const canvas = gl.domElement
    const mesh = scene.getObjectByName(targetName)
    meshRef.current = mesh

    const handleMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObject(mesh)
      if (intersects.length > 0 && intersects[0].uv) {
        setHoverUV(intersects[0].uv)
      } else {
        setHoverUV(null)
      }
    }

    const handleClick = () => {
      if (!hoverUV || !mesh) return
      const ctx = texture.image.getContext('2d')
      const x = hoverUV.x * texture.image.width
      const y = (1 - hoverUV.y) * texture.image.height

      if (!startUV) {
        setStartUV(hoverUV)
      } else {
        const x1 = startUV.x * texture.image.width
        const y1 = (1 - startUV.y) * texture.image.height

        ctx.strokeStyle = brushColor
        ctx.lineWidth = 2
        ctx.setLineDash([])
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x, y)
        ctx.stroke()

        texture.needsUpdate = true
        setStartUV(null)
      }
    }

    canvas.addEventListener('mousemove', handleMove)
    canvas.addEventListener('click', handleClick)
    return () => {
      canvas.removeEventListener('mousemove', handleMove)
      canvas.removeEventListener('click', handleClick)
    }
  }, [gl, scene, camera, targetName, brushColor, startUV, hoverUV, texture, active])

  return null
}

const Model = ({ url, settings, canvasTexture }) => {
  const { scene } = useGLTF(url)
  useEffect(() => {
    Object.entries(settings).forEach(([name, color]) => {
      const mesh = scene.getObjectByName(name)
      if (mesh && mesh.material) {
        mesh.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(color),
          metalness: 0,
          roughness: 1
        })
      }
    })
    const hoodie = scene.getObjectByName('Toon_Hoodie')
    if (hoodie && canvasTexture) {
      hoodie.material.map = canvasTexture
      hoodie.material.needsUpdate = true
    }
  }, [scene, settings, canvasTexture])
  return <primitive object={scene} />
}

export default function ModelViewer() {
  const [gender, setGender] = useState('male')
  const [brushColor, setBrushColor] = useState('#ff0000')
  const [paintingMode, setPaintingMode] = useState(true)
  const [colors, setColors] = useState({
    Toon_Hoodie: '#ff0000',
    Jogging_Pants: '#0000ff'
  })

  const handleColorChange = (part, value) => {
    setColors(prev => ({ ...prev, [part]: value }))
  }

  const modelUrl = `/models/${gender === 'male' ? 'Mannequin_Male.glb' : 'Mannequin_Female.glb'}`

  const [canvas] = useState(() => {
    const c = document.createElement('canvas')
    c.width = 1024
    c.height = 1024
    const ctx = c.getContext('2d')
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, c.width, c.height)
    return c
  })

  const canvasTexture = new THREE.CanvasTexture(canvas)
  canvasTexture.flipY = true

  const clearCanvas = () => {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    canvasTexture.needsUpdate = true
  }

  useEffect(() => {
    const viewerElement = document.querySelector(`.${styles.viewer}`)
    if (viewerElement) {
      viewerElement.style.cursor = paintingMode ? 'crosshair' : 'default'
    }
  }, [paintingMode])

  return (
    <div className={styles.container}>
      <div className={styles.viewer}>
        <Canvas className={styles.canvas} camera={{ position: [0, 1.5, 3] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 2, 2]} />
          <Model url={modelUrl} settings={colors} canvasTexture={canvasTexture} />
          <Painter targetName="Toon_Hoodie" texture={canvasTexture} brushColor={brushColor} active={paintingMode} />
          <OrbitControls enabled={!paintingMode} />
        </Canvas>
      </div>

      <div className={styles.sidebar}>
        <div className={styles.fixedHeader}>
          <h2>Настройка костюма</h2>
          <div className={styles.rowButtons}>
            <button className={gender === 'male' ? styles.active : ''} onClick={() => setGender('male')}>Мужской</button>
            <button className={gender === 'female' ? styles.active : ''} onClick={() => setGender('female')}>Женский</button>
          </div>

          <div className={styles.section}>
            <h3>Режим</h3>
            <div className={styles.grid}>
              <button onClick={() => setPaintingMode(true)} disabled={paintingMode}>Рисование</button>
              <button onClick={() => setPaintingMode(false)} disabled={!paintingMode}>Вращение</button>
            </div>
          </div>
        </div>

        <div className={styles.scrollable}>
          <div className={styles.section}>
            <h3>Цвет кисти</h3>
            <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} />
            <button onClick={clearCanvas}>Очистить рисунок</button>
          </div>

          <div className={styles.section}>
            <h3>Цвета одежды</h3>
            <label>
              Худи (Toon_Hoodie)
              <input type="color" value={colors.Toon_Hoodie} onChange={(e) => handleColorChange('Toon_Hoodie', e.target.value)} />
            </label>
            <label>
              Штаны (Jogging_Pants)
              <input type="color" value={colors.Jogging_Pants} onChange={(e) => handleColorChange('Jogging_Pants', e.target.value)} />
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.clear}>Очистить</button>
          <button className={styles.generate}>Генерация</button>
        </div>
      </div>
    </div>
  )
}
