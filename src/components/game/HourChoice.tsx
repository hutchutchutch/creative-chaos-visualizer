
import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Import lane colors from constants
import { LANE_COLORS, LANES } from './constants';

interface HourChoiceProps {
  position: [number, number, number];
  laneIndex: number;
  onCollide: (lane: number) => void;
  playerLane: number;
  gameSpeed: number;
}

const HourChoice = ({ position, laneIndex, onCollide, playerLane, gameSpeed }: HourChoiceProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [passed, setPassed] = useState(false);
  const [hour] = useState(Math.floor(Math.random() * 12) + 1);
  const initialZ = position[2];
  
  // For debugging
  useEffect(() => {
    console.log('Hour choice created:', { position, laneIndex, hour });
  }, []);
  
  // Get lane color based on index
  const getLaneColor = (index: number) => {
    switch(index) {
      case 0: return LANE_COLORS.happy;
      case 1: return LANE_COLORS.healthy;
      case 2: return LANE_COLORS.helpful;
      default: return new THREE.Color("#FFFFFF");
    }
  };
  
  useFrame(() => {
    if (meshRef.current && !passed) {
      // Move object toward player (positive Z direction)
      meshRef.current.position.z += gameSpeed;
      
      // Add a slight rotation for visual effect
      meshRef.current.rotation.y += 0.01;
      
      // Get current position
      const z = meshRef.current.position.z;
      
      // Debug log every 30 frames to track movement
      if (Math.floor(z * 10) % 30 === 0) {
        console.log('Hour choice moving:', { 
          laneIndex, 
          z,
          playerLane,
          distance: z - position[2],
          gameSpeed
        });
      }
      
      // Check if object has reached the player
      if (z > -1 && z < 1) {
        // In collision range
        if (playerLane === laneIndex && !passed) {
          console.log('Collision detected with hour choice:', { 
            laneIndex, 
            playerLane, 
            z,
            hour 
          });
          setPassed(true);
          onCollide(laneIndex);
        }
      }
      
      // If passed player without collision, mark as passed
      if (z >= 1 && !passed) {
        console.log('Hour choice missed:', { laneIndex, playerLane, z });
        setPassed(true);
      }
    }
  });
  
  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial 
          color={getLaneColor(laneIndex)} 
          emissive={getLaneColor(laneIndex)} 
          emissiveIntensity={0.5} 
        />
      </mesh>
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.5}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {`Hour ${hour}`}
      </Text>
    </group>
  );
};

export default HourChoice;
