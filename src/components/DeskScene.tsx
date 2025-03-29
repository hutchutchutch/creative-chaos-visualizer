
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useOrbitalCamera } from '../hooks/useOrbitalCamera';
import * as THREE from 'three';
import { MeshWobbleMaterial, MeshDistortMaterial } from '@react-three/drei';

const DeskScene: React.FC = () => {
  // Use our custom camera hook
  const cameraRef = useOrbitalCamera({
    radius: 6,
    height: 2.5,
    speed: 0.03,
  });

  // References for animated elements
  const papersRef = useRef<THREE.Group>(null);
  const deskRef = useRef<THREE.Mesh>(null);

  // Create paper instances with memoization for performance
  const papers = useMemo(() => {
    const instances = [];
    for (let i = 0; i < 30; i++) {
      // Random positions for the papers
      const position = [
        (Math.random() - 0.5) * 3,
        Math.random() * 2 + 0.1,
        (Math.random() - 0.5) * 3
      ];
      
      // Random rotation for papers
      const rotation = [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ];
      
      // Random scale for variety
      const scale = 0.1 + Math.random() * 0.2;
      
      instances.push({
        position,
        rotation,
        scale: [scale, scale, 0.01],
        speed: 0.2 + Math.random() * 0.8
      });
    }
    return instances;
  }, []);

  // Animation for papers
  useFrame((_, delta) => {
    if (papersRef.current) {
      papersRef.current.children.forEach((paper, i) => {
        // Get paper data
        const { speed } = papers[i];
        
        // Rotate each paper at different speeds
        paper.rotation.x += delta * speed * 0.2;
        paper.rotation.y += delta * speed * 0.3;
        paper.rotation.z += delta * speed * 0.1;
        
        // Add some vertical movement
        paper.position.y += Math.sin(Date.now() * 0.001 * speed) * delta * 0.05;
      });
    }
    
    // Subtle desk wobble
    if (deskRef.current) {
      deskRef.current.rotation.z = Math.sin(Date.now() * 0.0005) * 0.02;
    }
  });

  return (
    <>
      {/* Camera setup */}
      <perspectiveCamera 
        ref={cameraRef} 
        fov={45}
        aspect={window.innerWidth / window.innerHeight}
        near={0.1}
        far={1000}
        position={[0, 2.5, 6]}
      />
      
      {/* Lighting setup */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={0.8} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024} 
      />
      <spotLight 
        position={[-5, 8, -5]} 
        angle={0.5} 
        penumbra={0.8} 
        intensity={1.5} 
        castShadow 
        color="#9b87f5" 
      />
      <pointLight position={[0, 4, 0]} intensity={0.8} color="#E5DEFF" />
      
      {/* Desk */}
      <mesh 
        ref={deskRef}
        position={[0, 0, 0]} 
        receiveShadow 
        castShadow
      >
        <boxGeometry args={[4, 0.2, 2]} />
        <MeshWobbleMaterial 
          factor={0.05} 
          speed={0.5} 
          color="#403E43" 
          roughness={0.8} 
          metalness={0.2}
        />
      </mesh>
      
      {/* Desk legs */}
      {[[-1.8, -1, -0.9], [1.8, -1, -0.9], [-1.8, -1, 0.9], [1.8, -1, 0.9]].map((position, index) => (
        <mesh key={index} position={position} castShadow>
          <boxGeometry args={[0.1, 2, 0.1]} />
          <meshStandardMaterial color="#333" roughness={0.7} />
        </mesh>
      ))}
      
      {/* Paper group */}
      <group ref={papersRef}>
        {papers.map((paper, i) => (
          <mesh
            key={i}
            position={paper.position as [number, number, number]}
            rotation={paper.rotation as [number, number, number]}
            scale={paper.scale as [number, number, number]}
            castShadow
          >
            <boxGeometry args={[1, 1, 1]} />
            <MeshDistortMaterial
              speed={paper.speed * 0.5}
              distort={0.2}
              color="#E5DEFF"
              roughness={0.4}
              metalness={0.1}
            />
          </mesh>
        ))}
      </group>
      
      {/* Floor for shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <shadowMaterial opacity={0.2} />
      </mesh>
    </>
  );
};

export default DeskScene;
