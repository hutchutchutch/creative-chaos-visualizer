
import React, { useRef } from 'react';
import * as THREE from 'three';

interface CharacterProps {
  position: [number, number, number];
}

const Character = ({ position }: CharacterProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  return (
    <group position={position}>
      {/* Main body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.8, 1.2, 0.5]} />
        <meshStandardMaterial color="#8B5CF6" />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#FFD700" />
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
    </group>
  );
};

export default Character;
