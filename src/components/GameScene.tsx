
import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Import our extracted components
import Character from './game/Character';
import HourChoice from './game/HourChoice';
import Track from './game/Track';
import Background from './game/Background';
import HourIndicator from './game/HourIndicator';
import Lighting from './game/Lighting';

// Import constants
import { 
  LANES, 
  GAME_SPEED_INITIAL, 
  GAME_SPEED_INCREMENT, 
  OBSTACLE_INTERVAL_MIN,
  OBSTACLE_INTERVAL_MAX
} from './game/constants';

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
  
  useEffect(() => {
    // Handle player movement
    const handleMove = (e: CustomEvent) => {
      if (!gameActive) return;
      
      if (e.detail.direction === 'left' && playerLane > 0) {
        setPlayerLane(prev => prev - 1);
      } else if (e.detail.direction === 'right' && playerLane < 2) {
        setPlayerLane(prev => prev + 1);
      }
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
  }, [playerLane, gameActive]);
  
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
      <Lighting />
      
      {/* Player Character */}
      <Character position={[camera.position.x, 0.75, 3]} />
      
      {/* Track with lane colors */}
      <Track />
      
      {/* Background Elements */}
      <Background />
      
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
      <HourIndicator currentHour={currentHour} />
    </>
  );
};

export default GameScene;
