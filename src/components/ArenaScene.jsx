'use client'

import { Canvas, useFrame } from '@react-three/fiber'

import {
  Float,
  Environment,
  Stars
} from '@react-three/drei'

import { useRef } from 'react'

function FloatingOrb() {

  const mesh = useRef()

  useFrame((state) => {

    mesh.current.rotation.y += 0.003

    mesh.current.position.y =
      Math.sin(state.clock.elapsedTime) * 0.3

    mesh.current.rotation.x =
      state.mouse.y * 0.5

    mesh.current.rotation.z =
      state.mouse.x * 0.5
  })

  return (
    <Float speed={2} rotationIntensity={2}>

      <mesh ref={mesh}>

        <icosahedronGeometry args={[2, 1]} />

        <meshStandardMaterial
          color="#ff0080"
          emissive="#ff0080"
          emissiveIntensity={3}
          metalness={1}
          roughness={0}
        />

      </mesh>

    </Float>
  )
}

function FloatingRing() {

  const ring = useRef()

  useFrame(() => {

    ring.current.rotation.x += 0.002
    ring.current.rotation.y += 0.003
  })

  return (
    <mesh ref={ring}>

      <torusGeometry args={[4, 0.03, 16, 100]} />

      <meshStandardMaterial
        color="#ffffff"
        emissive="#ff0080"
        emissiveIntensity={1}
      />

    </mesh>
  )
}

function FloatingSphere() {

  const sphere = useRef()

  useFrame((state) => {

    sphere.current.position.x =
      Math.sin(state.clock.elapsedTime * 0.5) * 3

    sphere.current.position.y =
      Math.cos(state.clock.elapsedTime * 0.5) * 2
  })

  return (
    <mesh ref={sphere} position={[3, 2, -3]}>

      <sphereGeometry args={[0.4, 32, 32]} />

      <meshStandardMaterial
        color="#ffffff"
        emissive="#ff0080"
        emissiveIntensity={2}
      />

    </mesh>
  )
}

export default function ArenaScene() {
  return (
    <div className="absolute inset-0 z-0">

      <Canvas camera={{ position: [0, 0, 8] }}>

        {/* FOG */}
        <fog attach="fog" args={['#000000', 8, 20]} />

        {/* LIGHTS */}
        <ambientLight intensity={1} />

        <directionalLight
          position={[5, 5, 5]}
          intensity={3}
          color="#ff0080"
        />

        <pointLight
          position={[0, 0, 0]}
          intensity={5}
          color="#ff0080"
        />

        {/* ENVIRONMENT */}
        <Environment preset="city" />

        {/* PARTICLES */}
        <Stars
          radius={100}
          depth={50}
          count={4000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        {/* OBJECTS */}
        <FloatingOrb />

        <FloatingRing />

        <FloatingSphere />

      </Canvas>
    </div>
  )
}