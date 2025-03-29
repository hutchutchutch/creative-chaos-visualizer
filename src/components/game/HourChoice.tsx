
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Import lane colors from constants
import { LANE_COLORS } from './constants';

interface HourChoiceProps {
  position: [number, number, number];
  laneIndex: number;
  onCollide: (lane: number) => void;
}

const HourChoice = ({ position, laneIndex, onCollide }: HourChoiceProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [passed, setPassed] = useState(false);
  
  // Get lane color based on index
  const getLaneColor = (index: number) => {
    switch(index) {
      case 0: return LANE_COLORS.happy;
      case 1: return LANE_COLORS.healthy;
      case 2: return LANE_COLORS.helpful;
      default: return new THREE.Color("#FFFFFF");
    }
  };
  
  useFrame(({ camera }) => {
    if (meshRef.current) {
      // Move object toward player (positive Z direction)
      meshRef.current.position.z += 0.15;
      
      // Add a slight rotation for visual effect
      meshRef.current.rotation.y += 0.01;
      
      // Check if object has passed the player
      if (meshRef.current.position.z > 4 && !passed) {
        setPassed(true);
        // Determine if player made the right choice
        const playerLane = Math.round((camera.position.x + LANE_WIDTH) / LANE_WIDTH);
        if (playerLane === laneIndex) {
          // Player picked this hour choice
          onCollide(laneIndex);
        }
      }
      
      // Remove if too far
      if (meshRef.current.position.z > 10) {
        meshRef.current.removeFromParent();
      }
    }
  });
  
  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial color={getLaneColor(laneIndex)} emissive={getLaneColor(laneIndex)} emissiveIntensity={0.3} />
      </mesh>
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.4}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        {`Hour ${Math.floor(Math.random() * 12) + 1}`}
      </Text>
    </group>
  );
};

// Export LANE_WIDTH for use in this component
const LANE_WIDTH = 2;
export { LANE_WIDTH };
export default HourChoice;
