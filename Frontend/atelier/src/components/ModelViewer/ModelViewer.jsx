import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { useEffect } from 'react'

const Model = ({ settings, url }) => {
  const { scene } = useGLTF(url)

  useEffect(() => {
    Object.entries(settings).forEach(([name, color]) => {
      const mesh = scene.getObjectByName(name)
      if (mesh && mesh.material) mesh.material.color.set(color)
    })
  }, [settings])

  return <primitive object={scene} />
}

export default function ModelViewer() {
  const isMale = true
  const url = isMale ? "/models/Mannequin_Male.glb" : "/models/Mannequin_Female.glb"

  const settings = {
    Sweater_Male: "#ff0000",
    LeftSleeve_Male: "#00ff00",
    RightSleeve_Male: "#0000ff",
    Pants_Male: "#4444ff"
  }

  return (
    <Canvas camera={{ position: [0, 1.5, 3] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} />
      <Model settings={settings} url={url} />
      <OrbitControls />
    </Canvas>
  )
}