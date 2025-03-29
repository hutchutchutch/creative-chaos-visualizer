import React, { useCallback, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { LANES } from './game/constants';

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

interface GameSceneProps {
  forceGameActive?: boolean;
}

// Define the handle type
export interface GameSceneHandle {
  forceGameStart: () => void;
}

const GameScene = forwardRef<GameSceneHandle, GameSceneProps>((props, ref) => {
  const { forceGameActive } = props;
  const { camera } = useThree();
  
  // Game state management with forceGameStart method
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
    setHealth,
    forceGameStart
  } = useGameState();
  
  console.log("🔍 GameScene rendered, gameActive:", gameActive);
  
  // Hour choices management
  const { hourChoices, updateHourChoices, updateFrame, setHourChoices } = useHourChoices(gameSpeed, gameActive, forceGameActive);
  
  // Player controls with enhanced movement feedback
  const { getPlayerPosition, isMoving, moveDirection } = usePlayerControls(playerLane, setPlayerLane, gameActive, forceGameActive);
  
  // Reset functionality
  const frameCounter = useRef(0);
  const resetFrameCounters = useCallback(() => {
    frameCounter.current = 0;
  }, [setGameActive, forceGameStart, setHourChoices]);
  
  useGameReset({
    setGameActive,
    setCurrentHour,
    setHealth,
    setHourChoices,
    setGameSpeed,
    setDailySchedule,
    resetFrameCounters
  });
  
  // Force the game to start when the component mounts
  useEffect(() => {
    console.log("🔍 MOUNT: Component mounted, forcing game to start");
    setGameActive(true);
    forceGameStart();
    
    // Force spawn a new hour choice immediately
    const lane = Math.floor(Math.random() * 3);
    const newId = Math.floor(Math.random() * 1000);
    
    const newChoicePosition = new THREE.Vector3(
      LANES[lane],
      0.5, // Position slightly above ground
      -30 // Start farther from player for more reaction time
    );
    
    console.log('🔍 MOUNT: Forcing spawn of new hour choice');
    setHourChoices(prev => {
      const newChoices = [
        ...prev, 
        {position: newChoicePosition, lane, id: newId}
      ];
      console.log('🔍 MOUNT: New hour choices count:', newChoices.length);
      return newChoices;
    });
  }, [setGameActive, forceGameStart, setHourChoices]);
  
  // Listen for game start event - IMPORTANT: Remove gameActive from dependency array
  useEffect(() => {
    console.log("🔍 SETUP: Setting up game-start event listener in GameScene");
    
    const handleGameStart = () => {
      console.log("🔍 HANDLER: Game-start event received in GameScene, setting gameActive to true");
      console.log("🔍 HANDLER: gameActive before:", gameActive);
      
      // Try to directly set gameActive to true
      setGameActive(true);
      console.log("🔍 HANDLER: Called setGameActive(true)");
      
      // Force update gameActive with a direct call to ensure it's set
      setTimeout(() => {
        console.log("🔍 HANDLER TIMEOUT: Checking gameActive after timeout:", gameActive);
        if (!gameActive) {
          console.log("🔍 HANDLER TIMEOUT: gameActive still false after timeout, forcing update");
          setGameActive(true);
          console.log("🔍 HANDLER TIMEOUT: Called setGameActive(true) again");
        }
      }, 100);
      
      // Try dispatching a custom event to trigger a re-render
      setTimeout(() => {
        console.log("🔍 HANDLER TIMEOUT 2: Dispatching game-active-force event");
        window.dispatchEvent(new CustomEvent('game-active-force'));
      }, 200);
    };
    
    // Add a listener for the custom force event
    const handleForceActive = () => {
      console.log("🔍 FORCE: Received game-active-force event, forcing gameActive to true");
      setGameActive(true);
    };
    
    console.log("🔍 SETUP: Current gameActive:", gameActive);
    window.addEventListener('game-start', handleGameStart);
    window.addEventListener('game-active-force', handleForceActive);
    
    // Dispatch a test event to check if the listener is working
    console.log("🔍 SETUP: Testing event listener with custom test event");
    window.dispatchEvent(new CustomEvent('test-event'));
    
    return () => {
      console.log("🔍 CLEANUP: Cleaning up game-start event listener in GameScene");
      window.removeEventListener('game-start', handleGameStart);
      window.removeEventListener('game-active-force', handleForceActive);
    };
  }, []); // Remove all dependencies to prevent re-registering the event listener
  
  // Add a separate effect to log gameActive changes
  useEffect(() => {
    console.log("🔍 GameScene: gameActive changed to:", gameActive);
    
    // If gameActive is true, log that the game should be running
    if (gameActive) {
      console.log("🔍 Game is now active, game loop should be running");
    }
  }, [gameActive]);
  
  // Use the forceGameActive prop to set gameActive
  useEffect(() => {
    console.log("🔍 FORCE PROP: forceGameActive prop changed to:", forceGameActive);
    if (forceGameActive) {
      console.log("🔍 FORCE PROP: Setting gameActive to true based on forceGameActive prop");
      
      // Call forceGameStart directly instead of just setGameActive
      forceGameStart();
      
      console.log("🔍 FORCE PROP: Called forceGameStart() directly");
      
      // Force spawn a new hour choice immediately
      const lane = Math.floor(Math.random() * 3);
      const newId = Math.floor(Math.random() * 1000);
      
      const newChoicePosition = new THREE.Vector3(
        LANES[lane],
        0.5, // Position slightly above ground
        -30 // Start farther from player for more reaction time
      );
      
      console.log('🔍 FORCE PROP: Forcing spawn of new hour choice');
      setHourChoices(prev => {
        const newChoices = [
          ...prev, 
          {position: newChoicePosition, lane, id: newId}
        ];
        console.log('🔍 FORCE PROP: New hour choices count:', newChoices.length);
        return newChoices;
      });
    }
  }, [forceGameActive, forceGameStart, setHourChoices]);
  
  // For logging game loop status less frequently
  const gameLoopLogCounter = useRef(0);
  
  // Main game loop
  useFrame(() => {
    // Increment counter for less frequent logging
    gameLoopLogCounter.current += 1;
    
    // Check both gameActive state and forceGameActive prop
    const isActive = gameActive || forceGameActive;
    
    // Log every 60 frames for debugging
    if (gameLoopLogCounter.current % 60 === 0) {
      console.log("🔍 Game loop - gameActive:", gameActive, "forceGameActive:", forceGameActive, "isActive:", isActive);
    }
    
    if (!isActive) {
      // Only log every 60 frames to reduce console spam
      if (gameLoopLogCounter.current % 60 === 0) {
        console.log("🔍 Game loop skipped - gameActive:", gameActive, "forceGameActive:", forceGameActive);
      }
      return;
    }
    
    // Only log every 60 frames to reduce console spam
    if (gameLoopLogCounter.current % 60 === 0) {
      console.log("🔍 Game loop running - gameActive is true");
    }
    
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
  
  // Expose the forceGameStart method to the parent component
  useImperativeHandle(ref, () => ({
    forceGameStart: () => {
      console.log("🔍 IMPERATIVE: forceGameStart called from parent");
      forceGameStart();
    }
  }));
  
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
});

export default GameScene;
