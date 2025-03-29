
import React, { useCallback, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

// Import our extracted components
import Character from './game/Character';
import HourChoice from './game/HourChoice';
import Track from './game/Track';
import Background from './game/Background';
import HourIndicator from './game/HourIndicator';
import Lighting from './game/Lighting';

// Import our hooks
import { useGameState } from '../hooks/useGameState';
import { useHourChoices } from '../hooks/useHourChoices';
import { usePlayerControls } from '../hooks/usePlayerControls';
import { useGameReset } from '../hooks/useGameReset';

const GameScene = () => {
  const { camera } = useThree();
  
  // Game state management
  const {
    playerLane,
    setPlayerLane,
    gameSpeed,
    setGameSpeed,
    health,
    gameActive,
    setGameActive,
    currentHour,
    setCurrentHour,
    dailySchedule,
    setDailySchedule,
    updateGameSpeed,
    handleLaneDecision,
    setHealth
  } = useGameState();
  
  // Hour choices management
  const { hourChoices, updateHourChoices, updateFrame, setHourChoices } = useHourChoices(gameSpeed, gameActive);
  
  // Player controls with enhanced movement feedback
  const { getPlayerPosition, isMoving, moveDirection } = usePlayerControls(playerLane, setPlayerLane, gameActive);
  
  // Reset functionality
  const frameCounter = useRef(0);
  const resetFrameCounters = useCallback(() => {
    frameCounter.current = 0;
  }, []);
  
  useGameReset({
    setGameActive,
    setCurrentHour,
    setHealth,
    setHourChoices,
    setGameSpeed,
    setDailySchedule,
    resetFrameCounters
  });
  
  // Main game loop
  useFrame(() => {
    if (!gameActive) return;
    
    // Update camera position based on player lane
    const targetX = getPlayerPosition();
    camera.position.x += (targetX - camera.position.x) * 0.1;
    
    // Update game speed less frequently (every 60 frames)
    frameCounter.current += 1;
    if (frameCounter.current % 60 === 0) {
      updateGameSpeed();
    }
    
    // Update existing hour choices (move them)
    updateHourChoices();
    
    // Update frame and potentially spawn new choices
    updateFrame();
  });
  
  return (
    <>
      {/* Lighting */}
      <Lighting />
      
      {/* Player Character */}
      <Character 
        position={[getPlayerPosition(), 0.75, 0]} 
        isMoving={isMoving} 
        moveDirection={moveDirection}
      />
      
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
