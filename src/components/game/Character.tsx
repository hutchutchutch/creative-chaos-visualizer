
import React, { useRef } from 'react';
import * as THREE from 'three';

interface CharacterProps {
  position: [number, number, number];
}

const Character = ({ position }: CharacterProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  return (
    <mesh ref={meshRef} position={position} castShadow>
      <boxGeometry args={[0.8, 1.5, 0.8]} />
      <meshStandardMaterial color="#E5DEFF" />
    </mesh>
  );
};

export default Character;
