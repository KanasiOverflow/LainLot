import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { useState, useEffect } from 'react'
import styles from './ModelViewer.module.css'

const Model = ({ url, settings }) => {
  const { scene } = useGLTF(url)

  useEffect(() => {
    Object.entries(settings).forEach(([name, color]) => {
      const mesh = scene.getObjectByName(name)
      if (mesh && mesh.material) {
        mesh.material.color.set(color)
      }
    })
  }, [scene, settings])

  return <primitive object={scene} />
}

export default function ModelViewer() {
  const [gender, setGender] = useState('male')

  const parts = [
    'Sweater', 'LeftSleeve', 'RightSleeve', 'Pants',
    'Neckline', 'Hood', 'Waistband', 'SleeveCuffs', 'PantCuffs'
  ]

  const [colors, setColors] = useState(
    Object.fromEntries(parts.map(p => [`${p}_Male`, '#cccccc']))
  )

  const handleColorChange = (part, value) => {
    const key = `${part}_${gender.charAt(0).toUpperCase() + gender.slice(1)}`
    setColors(prev => ({ ...prev, [key]: value }))
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
            <button onClick={() => setGender('male')}>Мужской</button>
            <button onClick={() => setGender('female')}>Женский</button>
          </div>
        </div>

        <div className={styles.scrollable}>
          <div className={styles.section}>
            <h3>Цвета</h3>
            <div className={styles.colorGrid}>
              {parts.map(part => (
                <label key={part}>
                  {part}
                  <input
                    type="color"
                    value={colors[`${part}_${gender.charAt(0).toUpperCase() + gender.slice(1)}`]}
                    onChange={(e) => handleColorChange(part, e.target.value)}
                  />
                </label>
              ))}
            </div>
          </div>

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
            <h3>Детали костюма</h3>
            <div className={styles.grid}>
              <button>Капюшон</button>
              <button>Горловина</button>
              <button>Рукава</button>
              <button>Манжеты рук</button>
              <button>Пояс</button>
              <button>Манжеты брюк</button>
            </div>
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
