import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { useState, useEffect } from 'react'
import * as THREE from 'three'
import styles from './ModelViewer.module.css'

const Model = ({ url, settings }) => {
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
  }, [scene, settings])

  return <primitive object={scene} />
}

export default function ModelViewer() {
  const [gender, setGender] = useState('male')

  const [colors, setColors] = useState({
    Clothes_Upper: '#ff0000',
    Clothes_Lower: '#0000ff'
  })

  const handleColorChange = (part, value) => {
    setColors(prev => ({ ...prev, [part]: value }))
  }

  const modelUrl = `/models/${gender === 'male' ? 'Mannequin_Male.glb' : 'Mannequin_Female.glb'}`

  return (
    <div className={styles.container}>
      <div className={styles.viewer}>
        <Canvas className={styles.canvas} camera={{ position: [0, 1.5, 3] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 2, 2]} />
          <Model url={modelUrl} settings={colors} />
          <OrbitControls />
        </Canvas>
      </div>

      <div className={styles.sidebar}>
        <div className={styles.fixedHeader}>
          <h2>Настройка костюма</h2>
          <div className={styles.rowButtons}>
            <button
              className={gender === 'male' ? styles.active : ''}
              onClick={() => setGender('male')}
            >
              Мужской
            </button>
            <button
              className={gender === 'female' ? styles.active : ''}
              onClick={() => setGender('female')}
            >
              Женский
            </button>
          </div>

        </div>

        <div className={styles.scrollable}>
          <div className={styles.section}>
            <h3>Размер</h3>
            <div className={styles.grid}>
              {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                <button key={size}>{size}</button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h3>Рост</h3>
            <div className={styles.grid}>
              {[150, 160, 170, 180, 190].map(h => (
                <button key={h}>{h} см</button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h3>Покраска</h3>
            <label>
              Майка (Clothes_Upper)
              <input
                type="color"
                value={colors.Clothes_Upper}
                onChange={(e) => handleColorChange('Clothes_Upper', e.target.value)}
              />
            </label>
            <label>
              Шорты (Clothes_Lower)
              <input
                type="color"
                value={colors.Clothes_Lower}
                onChange={(e) => handleColorChange('Clothes_Lower', e.target.value)}
              />
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
