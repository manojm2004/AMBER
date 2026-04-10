import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Sparkles, MeshDistortMaterial } from '@react-three/drei';

function MilkDrop() {
  const meshRef = useRef();
  
  useFrame((state) => {
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    // adding slight float so it moves down screen mildly? 
    // Actually parallax is better, but simple slow spin is standard.
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={meshRef} position={[0, -0.5, -2]}>
        <sphereGeometry args={[1.8, 128, 128]} />
        <MeshDistortMaterial 
          distort={0.35} 
          speed={2.5} 
          color="#f8fafc" 
          roughness={0.05}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1.5}
        />
      </mesh>
    </Float>
  );
}

export default function Global3DBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-40 xl:opacity-60">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.9} color="#ffffff" />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        
        <MilkDrop />
        
        {/* Soft clinical particle effects spanning entire screen space */}
        <Sparkles count={80} scale={15} size={3} color="#3A7DFF" speed={0.4} opacity={0.3} />
        <Sparkles count={50} scale={15} size={2} color="#28C76F" speed={0.2} opacity={0.2} />
        
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}
