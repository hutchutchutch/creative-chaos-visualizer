
import { useState, useRef, useCallback } from 'react';
import * as THREE from 'three';
import {
  LANES,
  OBSTACLE_INTERVAL_MIN,
  OBSTACLE_INTERVAL_MAX
} from '../components/game/constants';

export interface HourChoice {
  position: THREE.Vector3;
  lane: number;
  id: number;
}

export const useHourChoices = (gameSpeed: number, gameActive: boolean) => {
  const [hourChoices, setHourChoices] = useState<HourChoice[]>([]);
  const nextChoiceTime = useRef(Math.floor(Math.random() * 
    (OBSTACLE_INTERVAL_MAX - OBSTACLE_INTERVAL_MIN) + OBSTACLE_INTERVAL_MIN));
  const frameCount = useRef(0);
  const choiceIdCounter = useRef(0);

  // Function to update hour choices positions
  const updateHourChoices = useCallback(() => {
    if (!gameActive) return;
    
    setHourChoices(prev => {
      return prev
        .map(choice => {
          // Move objects toward the player
          const newPosition = new THREE.Vector3(
            choice.position.x,
            choice.position.y,
            choice.position.z + gameSpeed
          );
          
          return { ...choice, position: newPosition };
        })
        .filter(choice => choice.position.z < 10); // Remove if too far past the player
    });
  }, [gameSpeed, gameActive]);

  // Handle frame update
  const updateFrame = useCallback(() => {
    if (!gameActive) return false;

    // Increment frame counter
    frameCount.current++;
    
    // Debug log every 100 frames
    if (frameCount.current % 100 === 0) {
      console.log('Game loop - Frame:', frameCount.current, 
        'Next choice in:', nextChoiceTime.current - frameCount.current,
        'Hour choices:', hourChoices.length,
        'Game speed:', gameSpeed);
    }
    
    // Check if it's time to spawn a new hour choice
    if (frameCount.current >= nextChoiceTime.current) {
      // Random lane for hour choice
      const lane = Math.floor(Math.random() * 3);
      const newId = choiceIdCounter.current++;
      
      const newChoicePosition = new THREE.Vector3(
        LANES[lane],
        0.5, // Position slightly above ground
        -20 // Start closer to player for better visibility
      );
      
      setHourChoices(prev => [
        ...prev, 
        {position: newChoicePosition, lane, id: newId}
      ]);
      
      console.log('Spawned new hour choice:', { lane, id: newId, position: newChoicePosition });
      
      // Reset counter and set next choice time
      frameCount.current = 0;
      nextChoiceTime.current = Math.floor(Math.random() * 
        (OBSTACLE_INTERVAL_MAX - OBSTACLE_INTERVAL_MIN) + OBSTACLE_INTERVAL_MIN);
      
      return true; // Indicate a new choice was spawned
    }
    
    return false; // No new choice was spawned
  }, [gameSpeed, gameActive, hourChoices.length]);

  return {
    hourChoices,
    updateHourChoices,
    updateFrame
  };
};
