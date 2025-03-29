
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
  const [rotation] = useState({
    x: Math.random() * 0.1,
    y: Math.random() * 0.1,
    z: Math.random() * 0.1
  });
  
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
  
  // Get geometry based on lane type
  const getGeometry = (index: number) => {
    switch(index) {
      case 0: return <sphereGeometry args={[0.7, 16, 16]} />; // Happy: Sphere
      case 1: return <dodecahedronGeometry args={[0.7, 0]} />; // Healthy: Dodecahedron
      case 2: return <octahedronGeometry args={[0.7, 0]} />; // Helpful: Octahedron
      default: return <boxGeometry args={[1.2, 1.2, 1.2]} />;
    }
  };
  
  // Get label based on lane index
  const getLaneLabel = (index: number) => {
    switch(index) {
      case 0: return "Happy";
      case 1: return "Healthy";
      case 2: return "Helpful";
      default: return "";
    }
  };
  
  useFrame(() => {
    if (meshRef.current && !passed) {
      // Move object toward player (positive Z direction)
      meshRef.current.position.z += gameSpeed;
      
      // Add rotation for visual effect based on lane type
      meshRef.current.rotation.x += rotation.x;
      meshRef.current.rotation.y += rotation.y;
      meshRef.current.rotation.z += rotation.z;
      
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
  
  // Create a pulsing effect
  const [scale, setScale] = useState(1);
  useFrame(({ clock }) => {
    // Subtle pulsing effect
    if (meshRef.current) {
      const newScale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.05;
      setScale(newScale);
      meshRef.current.scale.set(newScale, newScale, newScale);
    }
  });
  
  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow>
        {getGeometry(laneIndex)}
        <meshStandardMaterial 
          color={getLaneColor(laneIndex)} 
          emissive={getLaneColor(laneIndex)} 
          emissiveIntensity={0.5} 
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>
      
      {/* Lane Type Label */}
      <Text
        position={[0, 1.0, 0]}
        fontSize={0.3}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {getLaneLabel(laneIndex)}
      </Text>
      
      {/* Hour Number */}
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
      
      {/* Add a glowing halo effect */}
      <mesh position={[0, 0, -0.1]} scale={[1.2, 1.2, 0.1]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial 
          color={getLaneColor(laneIndex)} 
          transparent 
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default HourChoice;
