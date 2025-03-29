
import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Box, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const LANE_WIDTH = 2;
const LANES = [-LANE_WIDTH, 0, LANE_WIDTH];
const GAME_SPEED_INITIAL = 0.1;
const GAME_SPEED_INCREMENT = 0.0001;
const OBSTACLE_INTERVAL_MIN = 60;
const OBSTACLE_INTERVAL_MAX = 100;

const Character = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  return (
    <mesh ref={meshRef} position={position} castShadow>
      <boxGeometry args={[0.8, 1.5, 0.8]} />
      <meshStandardMaterial color="#E5DEFF" />
    </mesh>
  );
};

const Obstacle = ({ position, onCollide }: { position: [number, number, number], onCollide: () => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [passed, setPassed] = useState(false);
  
  useFrame(({ camera }) => {
    if (meshRef.current) {
      // Move obstacle toward player
      meshRef.current.position.z += 0.2;
      
      // Check if obstacle is passed the player
      if (meshRef.current.position.z > 4 && !passed) {
        setPassed(true);
        window.dispatchEvent(new CustomEvent('score-update', { 
          detail: { score: 1, type: 'add' } 
        }));
      }
      
      // Check collision (simplified)
      if (Math.abs(meshRef.current.position.z - 3) < 1 && 
          Math.abs(meshRef.current.position.x - camera.position.x) < 1) {
        onCollide();
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
      <meshStandardMaterial color="#ff4d4d" />
    </mesh>
  );
};

const Track = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[10, 100]} />
      <meshStandardMaterial color="#333" />
    </mesh>
  );
};

const GameScene = () => {
  const { camera } = useThree();
  const [playerLane, setPlayerLane] = useState(1); // Start in middle lane (index 1)
  const [gameSpeed, setGameSpeed] = useState(GAME_SPEED_INITIAL);
  const [obstacles, setObstacles] = useState<THREE.Vector3[]>([]);
  const [gameActive, setGameActive] = useState(true);
  const [score, setScore] = useState(0);
  const nextObstacleTime = useRef(Math.floor(Math.random() * 
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
    
    // Handle score updates
    const handleScoreUpdate = (e: CustomEvent) => {
      if (e.detail.type === 'add') {
        setScore(prev => prev + e.detail.score);
      }
    };
    
    // Handle game restart
    const handleRestart = () => {
      setGameActive(true);
      setScore(0);
      setGameSpeed(GAME_SPEED_INITIAL);
      setObstacles([]);
      frameCount.current = 0;
    };
    
    window.addEventListener('game-move', handleMove as EventListener);
    window.addEventListener('score-update', handleScoreUpdate as EventListener);
    window.addEventListener('game-restart', handleRestart);
    
    return () => {
      window.removeEventListener('game-move', handleMove as EventListener);
      window.removeEventListener('score-update', handleScoreUpdate as EventListener);
      window.removeEventListener('game-restart', handleRestart);
    };
  }, [playerLane, gameActive, scene]);
  
  // Handle game over
  const handleCollision = () => {
    if (gameActive) {
      setGameActive(false);
      window.dispatchEvent(new CustomEvent('game-over'));
    }
  };
  
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
    
    // Spawn new obstacles
    if (frameCount.current >= nextObstacleTime.current) {
      // Random lane for obstacle
      const lane = Math.floor(Math.random() * 3);
      const newObstaclePosition = new THREE.Vector3(
        LANES[lane],
        0,
        -50 // Far ahead
      );
      
      setObstacles(prev => [...prev, newObstaclePosition]);
      
      // Reset counter and set next obstacle time
      frameCount.current = 0;
      nextObstacleTime.current = Math.floor(Math.random() * 
        (OBSTACLE_INTERVAL_MAX - OBSTACLE_INTERVAL_MIN) + OBSTACLE_INTERVAL_MIN);
    }
  });
  
  // Update App.tsx to add the route
  useEffect(() => {
    // Dispatch score updates to the parent component
    window.dispatchEvent(new CustomEvent('score-update', { 
      detail: { score, type: 'set' } 
    }));
  }, [score]);
  
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
      
      {/* Track */}
      <Track />
      
      {/* Background Elements (Desk model) */}
      <group ref={deskRef} />
      
      {/* Obstacles */}
      {obstacles.map((position, i) => (
        <Obstacle 
          key={i} 
          position={[position.x, 0.5, position.z]}
          onCollide={handleCollision}
        />
      ))}
      
      {/* Sky */}
      <mesh position={[0, 0, -100]}>
        <planeGeometry args={[200, 100]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
    </>
  );
};

export default GameScene;
