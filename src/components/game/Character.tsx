
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface CharacterProps {
  position: [number, number, number];
}

const Character = ({ position }: CharacterProps) => {
  const meshRef = useRef<THREE.Group>(null);
  
  // For debugging
  useEffect(() => {
    console.log('Character initialized at position:', position);
  }, [position]);
  
  return (
    <group ref={meshRef} position={position}>
      {/* Main body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.8, 1.2, 0.5]} />
        <meshStandardMaterial color="#8B5CF6" emissive="#8B5CF6" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.6, 0, 0]} castShadow>
        <boxGeometry args={[0.3, 0.8, 0.3]} />
        <meshStandardMaterial color="#8B5CF6" />
      </mesh>
      <mesh position={[0.6, 0, 0]} castShadow>
        <boxGeometry args={[0.3, 0.8, 0.3]} />
        <meshStandardMaterial color="#8B5CF6" />
      </mesh>
      
      {/* Add a light source to character to make it more visible */}
      <pointLight position={[0, 1, 0]} intensity={1} distance={3} color="#FFFFFF" />
    </group>
  );
};

export default Character;
