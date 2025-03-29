
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
  OBSTACLE_INTERVAL_MAX,
  LANE_TITLES
} from './game/constants';

const GameScene = () => {
  const { camera } = useThree();
  const [playerLane, setPlayerLane] = useState(1); // Start in middle lane (index 1)
  const [gameSpeed, setGameSpeed] = useState(GAME_SPEED_INITIAL);
  const [health, setHealth] = useState<{happy: number, healthy: number, helpful: number}>({
    happy: 5, // Start with mid-level health
    healthy: 5,
    helpful: 5
  });
  const [hourChoices, setHourChoices] = useState<{position: THREE.Vector3, lane: number, id: number}[]>([]);
  const [gameActive, setGameActive] = useState(true);
  const [currentHour, setCurrentHour] = useState(1);
  const [dailySchedule, setDailySchedule] = useState<string[]>(Array(16).fill(''));
  const nextChoiceTime = useRef(Math.floor(Math.random() * 
    (OBSTACLE_INTERVAL_MAX - OBSTACLE_INTERVAL_MIN) + OBSTACLE_INTERVAL_MIN));
  const frameCount = useRef(0);
  const choiceIdCounter = useRef(0);
  
  // Debug info
  useEffect(() => {
    console.log('GameScene initialized with:', { 
      playerLane, 
      gameSpeed, 
      health, 
      hourChoices: hourChoices.length, 
      gameActive, 
      currentHour 
    });
  }, []);
  
  // Handle health updates for lane decision
  const handleLaneDecision = (laneIdx: number) => {
    console.log('Lane decision made:', { laneIdx, currentHour });
    
    // Record the choice for the daily schedule
    const newSchedule = [...dailySchedule];
    newSchedule[currentHour - 1] = LANE_TITLES[laneIdx];
    setDailySchedule(newSchedule);
    
    // Update health traits based on choice
    setHealth(prev => {
      const newHealth = { ...prev };
      
      // Increase chosen trait
      if (laneIdx === 0) {
        newHealth.happy = Math.min(10, prev.happy + 0.8);
        newHealth.healthy = Math.max(0, prev.healthy - 0.2);
        newHealth.helpful = Math.max(0, prev.helpful - 0.2);
      } else if (laneIdx === 1) {
        newHealth.healthy = Math.min(10, prev.healthy + 0.8);
        newHealth.happy = Math.max(0, prev.happy - 0.2);
        newHealth.helpful = Math.max(0, prev.helpful - 0.2);
      } else if (laneIdx === 2) {
        newHealth.helpful = Math.min(10, prev.helpful + 0.8);
        newHealth.happy = Math.max(0, prev.happy - 0.2);
        newHealth.healthy = Math.max(0, prev.healthy - 0.2);
      }
      
      console.log('Health updated:', newHealth);
      return newHealth;
    });
    
    // Advance to next hour
    setCurrentHour(prev => prev + 1);
    
    // Update score to track total decisions made
    window.dispatchEvent(new CustomEvent('score-update', { 
      detail: { score: 1, type: 'add' } 
    }));

    // Also dispatch health update event
    window.dispatchEvent(new CustomEvent('health-update', {
      detail: { health }
    }));
  };
  
  useEffect(() => {
    // Handle player movement
    const handleMove = (e: CustomEvent) => {
      if (!gameActive) return;
      
      const newLane = e.detail.direction === 'left' && playerLane > 0 
        ? playerLane - 1 
        : e.detail.direction === 'right' && playerLane < 2 
        ? playerLane + 1 
        : playerLane;
      
      if (newLane !== playerLane) {
        console.log('Player moved to lane:', newLane);
        setPlayerLane(newLane);
      }
    };
    
    // Handle game restart
    const handleRestart = () => {
      console.log('Game restarted');
      setGameActive(true);
      setCurrentHour(1);
      setHealth({happy: 5, healthy: 5, helpful: 5});
      setHourChoices([]);
      setGameSpeed(GAME_SPEED_INITIAL);
      setDailySchedule(Array(16).fill(''));
      frameCount.current = 0;
      choiceIdCounter.current = 0;
      
      window.dispatchEvent(new CustomEvent('score-update', { 
        detail: { score: 0, type: 'set' } 
      }));

      window.dispatchEvent(new CustomEvent('health-update', {
        detail: { health: {happy: 5, healthy: 5, helpful: 5} }
      }));
    };
    
    window.addEventListener('game-move', handleMove as EventListener);
    window.addEventListener('game-restart', handleRestart);
    
    return () => {
      window.removeEventListener('game-move', handleMove as EventListener);
      window.removeEventListener('game-restart', handleRestart);
    };
  }, [playerLane, gameActive]);
  
  // Handle game over at 16 hours
  useEffect(() => {
    if (currentHour > 16 && gameActive) {
      console.log('Game over reached, health:', health, 'schedule:', dailySchedule);
      setGameActive(false);
      window.dispatchEvent(new CustomEvent('game-over'));
      
      // Send health data and schedule to display in game over screen
      window.dispatchEvent(new CustomEvent('game-choices', { 
        detail: { health, schedule: dailySchedule } 
      }));
    }
  }, [currentHour, health, gameActive, dailySchedule]);
  
  // Function to update hour choices positions
  const updateHourChoices = useCallback(() => {
    setHourChoices(prev => {
      return prev
        .map(choice => {
          // Move objects toward the player
          const newPosition = new THREE.Vector3(
            choice.position.x,
            choice.position.y,
            choice.position.z + gameSpeed * 2
          );
          
          return { ...choice, position: newPosition };
        })
        .filter(choice => choice.position.z < 10); // Remove if too far past the player
    });
  }, [gameSpeed]);
  
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
    
    // Update existing hour choices (move them)
    updateHourChoices();
    
    // Spawn new hour choice objects
    if (frameCount.current >= nextChoiceTime.current) {
      // Random lane for hour choice
      const lane = Math.floor(Math.random() * 3);
      const newId = choiceIdCounter.current++;
      
      const newChoicePosition = new THREE.Vector3(
        LANES[lane],
        0.5, // Position slightly above ground
        -50 // Far ahead
      );
      
      setHourChoices(prev => [
        ...prev, 
        {position: newChoicePosition, lane, id: newId}
      ]);
      
      console.log('Spawned new hour choice:', { lane, id: newId, z: -50 });
      
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
      <Character position={[camera.position.x, 0.75, 0]} />
      
      {/* Track with lane colors */}
      <Track />
      
      {/* Background Elements */}
      <Background />
      
      {/* Hour Choice Objects */}
      {hourChoices.map((choice) => (
        <HourChoice 
          key={choice.id} 
          position={[choice.position.x, choice.position.y, choice.position.z]}
          laneIndex={choice.lane}
          onCollide={handleLaneDecision}
          playerLane={playerLane}
          gameSpeed={gameSpeed}
        />
      ))}
      
      {/* Current hour indicator */}
      <HourIndicator currentHour={currentHour} totalHours={16} />
    </>
  );
};

export default GameScene;
