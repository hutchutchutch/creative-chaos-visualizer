
import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Box, Text, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Lane configuration
const LANE_WIDTH = 2;
const LANES = [-LANE_WIDTH, 0, LANE_WIDTH]; // Left, Middle, Right
const LANE_COLORS = {
  happy: new THREE.Color("#D3E4FD"), // Light Blue
  healthy: new THREE.Color("#F2FCE2"), // Light Green
  helpful: new THREE.Color("#E5DEFF")  // Light Purple
};
const LANE_TITLES = ["Happy", "Healthy", "Helpful"];

// Game constants
const GAME_SPEED_INITIAL = 0.1;
const GAME_SPEED_INCREMENT = 0.0001;
const OBSTACLE_INTERVAL_MIN = 60;
const OBSTACLE_INTERVAL_MAX = 100;

// Character component
const Character = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  return (
    <mesh ref={meshRef} position={position} castShadow>
      <boxGeometry args={[0.8, 1.5, 0.8]} />
      <meshStandardMaterial color="#E5DEFF" />
    </mesh>
  );
};

// Hour choice object
const HourChoice = ({ 
  position, 
  laneIndex,
  onCollide 
}: { 
  position: [number, number, number], 
  laneIndex: number,
  onCollide: (lane: number) => void 
}) => {
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
      // Move object toward player
      meshRef.current.position.z += 0.2;
      
      // Check if object is passed the player
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
    <mesh ref={meshRef} position={position} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={getLaneColor(laneIndex)} />
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.3}
        color="#333333"
        anchorX="center"
        anchorY="middle"
      >
        {`Hour ${Math.floor(Math.random() * 12) + 1}`}
      </Text>
    </mesh>
  );
};

// Lane headers
const LaneHeaders = () => {
  return (
    <group position={[0, 2.5, -30]}>
      {LANES.map((lane, index) => (
        <group key={index} position={[lane, 0, 0]}>
          <Text
            position={[0, 0, 0]}
            fontSize={1.5}
            color="#333333"
            font="/fonts/Inter-Bold.woff"
            anchorX="center"
            anchorY="middle"
          >
            {LANE_TITLES[index]}
          </Text>
          {/* Lane color indicator */}
          <mesh position={[0, -1.5, 0]}>
            <boxGeometry args={[1.8, 0.5, 0.1]} />
            <meshStandardMaterial color={
              index === 0 ? LANE_COLORS.happy : 
              index === 1 ? LANE_COLORS.healthy : 
              LANE_COLORS.helpful
            } />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// Colored Lane
const Lane = ({ index }: { index: number }) => {
  const color = 
    index === 0 ? LANE_COLORS.happy : 
    index === 1 ? LANE_COLORS.healthy : 
    LANE_COLORS.helpful;
  
  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[LANES[index], -0.49, 0]} 
      receiveShadow
    >
      <planeGeometry args={[LANE_WIDTH * 0.9, 100]} />
      <meshStandardMaterial color={color} opacity={0.7} transparent />
    </mesh>
  );
};

// Track component
const Track = () => {
  return (
    <group>
      {/* Base track */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[10, 100]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* Colored lanes */}
      <Lane index={0} />
      <Lane index={1} />
      <Lane index={2} />
      
      {/* Lane dividers */}
      {[-1, 1].map((offset, i) => (
        <mesh 
          key={i}
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[offset * LANE_WIDTH, -0.48, 0]} 
          receiveShadow
        >
          <planeGeometry args={[0.1, 100]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      ))}
      
      {/* Lane headers */}
      <LaneHeaders />
    </group>
  );
};

const GameScene = () => {
  const { camera } = useThree();
  const [playerLane, setPlayerLane] = useState(1); // Start in middle lane (index 1)
  const [gameSpeed, setGameSpeed] = useState(GAME_SPEED_INITIAL);
  const [choices, setChoices] = useState<{happy: number, healthy: number, helpful: number}>({
    happy: 0,
    healthy: 0,
    helpful: 0
  });
  const [hourChoices, setHourChoices] = useState<{position: THREE.Vector3, lane: number}[]>([]);
  const [gameActive, setGameActive] = useState(true);
  const [currentHour, setCurrentHour] = useState(1);
  const nextChoiceTime = useRef(Math.floor(Math.random() * 
    (OBSTACLE_INTERVAL_MAX - OBSTACLE_INTERVAL_MIN) + OBSTACLE_INTERVAL_MIN));
  const frameCount = useRef(0);
  
  // Load desk model for background elements
  const { scene } = useGLTF('/desk3.glb');
  const deskRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (scene && deskRef.current) {
      // Clone and add the desk model
      const deskScene = scene.clone();
      deskScene.scale.set(0.5, 0.5, 0.5);
      deskScene.position.set(0, 0, -50);
      deskScene.rotation.y = Math.PI;
      deskRef.current.add(deskScene);
    }
    
    // Handle player movement
    const handleMove = (e: CustomEvent) => {
      if (!gameActive) return;
      
      if (e.detail.direction === 'left' && playerLane > 0) {
        setPlayerLane(prev => prev - 1);
      } else if (e.detail.direction === 'right' && playerLane < 2) {
        setPlayerLane(prev => prev + 1);
      }
    };
    
    // Handle score updates for lane decision
    const handleLaneDecision = (laneIdx: number) => {
      if (laneIdx === 0) {
        setChoices(prev => ({...prev, happy: prev.happy + 1}));
      } else if (laneIdx === 1) {
        setChoices(prev => ({...prev, healthy: prev.healthy + 1}));
      } else if (laneIdx === 2) {
        setChoices(prev => ({...prev, helpful: prev.helpful + 1}));
      }
      
      // Advance to next hour
      setCurrentHour(prev => prev + 1);
      
      // Update score to track total decisions made
      window.dispatchEvent(new CustomEvent('score-update', { 
        detail: { score: 1, type: 'add' } 
      }));
    };
    
    // Handle game restart
    const handleRestart = () => {
      setGameActive(true);
      setCurrentHour(1);
      setChoices({happy: 0, healthy: 0, helpful: 0});
      setHourChoices([]);
      setGameSpeed(GAME_SPEED_INITIAL);
      frameCount.current = 0;
      
      window.dispatchEvent(new CustomEvent('score-update', { 
        detail: { score: 0, type: 'set' } 
      }));
    };
    
    window.addEventListener('game-move', handleMove as EventListener);
    window.addEventListener('game-restart', handleRestart);
    
    return () => {
      window.removeEventListener('game-move', handleMove as EventListener);
      window.removeEventListener('game-restart', handleRestart);
    };
  }, [playerLane, gameActive, scene]);
  
  // Handle game over at 24 hours
  useEffect(() => {
    if (currentHour > 24 && gameActive) {
      setGameActive(false);
      window.dispatchEvent(new CustomEvent('game-over'));
      
      // Send choices data to display in game over screen
      window.dispatchEvent(new CustomEvent('game-choices', { 
        detail: { choices } 
      }));
    }
  }, [currentHour, choices, gameActive]);
  
  // Main game loop
  useFrame(() => {
    if (!gameActive) return;
    
    // Update camera position based on player lane
    const targetX = LANES[playerLane];
    camera.position.x += (targetX - camera.position.x) * 0.1;
    
    // Increment frame counter
    frameCount.current++;
    
    // Increase game speed over time
    setGameSpeed(prev => prev + GAME_SPEED_INCREMENT);
    
    // Spawn new hour choice objects
    if (frameCount.current >= nextChoiceTime.current) {
      // Random lane for hour choice
      const lane = Math.floor(Math.random() * 3);
      const newChoicePosition = new THREE.Vector3(
        LANES[lane],
        0,
        -50 // Far ahead
      );
      
      setHourChoices(prev => [...prev, {position: newChoicePosition, lane}]);
      
      // Reset counter and set next choice time
      frameCount.current = 0;
      nextChoiceTime.current = Math.floor(Math.random() * 
        (OBSTACLE_INTERVAL_MAX - OBSTACLE_INTERVAL_MIN) + OBSTACLE_INTERVAL_MIN);
    }
  });
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.0} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024} 
      />
      <spotLight 
        position={[-5, 8, 5]} 
        angle={0.5} 
        penumbra={0.8} 
        intensity={1.5} 
        castShadow 
        color="#9b87f5" 
      />
      
      {/* Player Character */}
      <Character position={[camera.position.x, 0.75, 3]} />
      
      {/* Track with lane colors */}
      <Track />
      
      {/* Background Elements (Desk model) */}
      <group ref={deskRef} />
      
      {/* Hour Choice Objects */}
      {hourChoices.map((choice, i) => (
        <HourChoice 
          key={i} 
          position={[choice.position.x, 0.5, choice.position.z]}
          laneIndex={choice.lane}
          onCollide={handleLaneDecision}
        />
      ))}
      
      {/* Current hour indicator */}
      <Text 
        position={[0, 3.5, -10]}
        fontSize={1.2}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        {`Hour ${currentHour} of 24`}
      </Text>
      
      {/* Sky */}
      <mesh position={[0, 0, -100]}>
        <planeGeometry args={[200, 100]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
    </>
  );
};

export default GameScene;
