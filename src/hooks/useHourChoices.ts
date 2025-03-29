
import { useState, useRef, useCallback, useEffect } from 'react';
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

export const useHourChoices = (gameSpeed: number, gameActive: boolean, forceGameActive?: boolean) => {
  // Use either gameActive or forceGameActive
  const isActive = gameActive || forceGameActive;
  const [hourChoices, setHourChoices] = useState<HourChoice[]>([]);
  const nextChoiceTime = useRef(Math.floor(Math.random() * 
    (OBSTACLE_INTERVAL_MAX - OBSTACLE_INTERVAL_MIN) + OBSTACLE_INTERVAL_MIN));
  const frameCount = useRef(0);
  const choiceIdCounter = useRef(0);
  
  // React to changes in forceGameActive prop
  useEffect(() => {
    console.log("🔍 HOUR CHOICES: forceGameActive changed to:", forceGameActive);
    
    if (forceGameActive) {
      console.log("🔍 HOUR CHOICES: forceGameActive is true, forcing spawn of new hour choice");
      
      // Force spawn a new hour choice immediately when forceGameActive becomes true
      const lane = Math.floor(Math.random() * 3);
      const newId = choiceIdCounter.current++;
      
      const newChoicePosition = new THREE.Vector3(
        LANES[lane],
        0.5, // Position slightly above ground
        -30 // Start farther from player for more reaction time
      );
      
      setHourChoices(prev => {
        const newChoices = [
          ...prev, 
          {position: newChoicePosition, lane, id: newId}
        ];
        console.log('🔍 HOUR CHOICES: New hour choices count:', newChoices.length);
        return newChoices;
      });
      
      // Reset frame counter to start the game loop
      frameCount.current = 0;
    }
  }, [forceGameActive]);

  // Function to update hour choices positions
  const updateHourChoices = useCallback(() => {
    if (!isActive) {
      // Log that we're skipping updates because game is not active
      if (frameCount.current % 60 === 0) {
        console.log("🔍 useHourChoices: Skipping hour choice updates - isActive is false, gameActive:", gameActive, "forceGameActive:", forceGameActive);
      }
      return;
    }
    
    console.log("🔍 useHourChoices: isActive is true, updating hour choices");
    
    // Log that we're updating hour choices
    if (frameCount.current % 60 === 0) {
      console.log("🔍 useHourChoices: Updating hour choices, isActive:", isActive, "count:", hourChoices.length);
    }
    
    setHourChoices(prev => {
      const updated = prev
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
      
      // Log if any choices were removed
      if (updated.length < prev.length) {
        console.log("🔍 useHourChoices: Removed", prev.length - updated.length, "hour choices that went past the player");
      }
      
      return updated;
    });
  }, [gameSpeed, isActive, hourChoices.length]);

  // Add a listener for the game-active-changed event
  useEffect(() => {
    const handleGameActiveChanged = (e: CustomEvent) => {
      console.log("🔍 HOUR CHOICES: Received game-active-changed event, detail:", e.detail);
      if (e.detail.active) {
        console.log("🔍 HOUR CHOICES: Game is now active, should start generating choices");
        
        // Force spawn a new hour choice immediately when the game becomes active
        const lane = Math.floor(Math.random() * 3);
        const newId = choiceIdCounter.current++;
        
        const newChoicePosition = new THREE.Vector3(
          LANES[lane],
          0.5, // Position slightly above ground
          -30 // Start farther from player for more reaction time
        );
        
        console.log('🔍 HOUR CHOICES: Forcing spawn of new hour choice on game start');
        setHourChoices(prev => {
          const newChoices = [
            ...prev, 
            {position: newChoicePosition, lane, id: newId}
          ];
          console.log('🔍 HOUR CHOICES: New hour choices count:', newChoices.length);
          return newChoices;
        });
        
        // Reset frame counter to start the game loop
        frameCount.current = 0;
      }
    };
    
    console.log("🔍 HOUR CHOICES: Setting up game-active-changed event listener");
    window.addEventListener('game-active-changed', handleGameActiveChanged as EventListener);
    
    return () => {
      window.removeEventListener('game-active-changed', handleGameActiveChanged as EventListener);
    };
  }, []);
  
  // Handle frame update
  const updateFrame = useCallback(() => {
    if (!isActive) {
      // Log that we're skipping frame updates because game is not active
      if (frameCount.current % 100 === 0) {
        console.log("🔍 HOUR CHOICES: Skipping frame update - isActive is false");
      }
      return false;
    }

    // Increment frame counter
    frameCount.current++;
    
    // Debug log every 100 frames
    if (frameCount.current % 100 === 0) {
      console.log('🔍 HOUR CHOICES: Game loop - Frame:', frameCount.current, 
        'Next choice in:', nextChoiceTime.current - frameCount.current,
        'Hour choices:', hourChoices.length,
        'Game speed:', gameSpeed,
        'isActive:', isActive);
    }
    
    // Check if it's time to spawn a new hour choice
    if (frameCount.current >= nextChoiceTime.current) {
      console.log('🔍 HOUR CHOICES: Time to spawn a new hour choice, isActive:', isActive);
      
      // Random lane for hour choice
      const lane = Math.floor(Math.random() * 3);
      const newId = choiceIdCounter.current++;
      
      const newChoicePosition = new THREE.Vector3(
        LANES[lane],
        0.5, // Position slightly above ground
        -30 // Start farther from player for more reaction time
      );
      
      // Ensure we're not creating too many choices
      if (hourChoices.length < 10) {
        console.log('🔍 HOUR CHOICES: Adding new hour choice to state, current count:', hourChoices.length);
        setHourChoices(prev => {
          const newChoices = [
            ...prev, 
            {position: newChoicePosition, lane, id: newId}
          ];
          console.log('🔍 HOUR CHOICES: New hour choices count:', newChoices.length);
          return newChoices;
        });
        
        console.log('🔍 HOUR CHOICES: Spawned new hour choice:', { lane, id: newId, position: newChoicePosition });
      } else {
        console.log('🔍 HOUR CHOICES: Too many hour choices, skipping spawn');
      }
      
      // Reset counter and set next choice time
      frameCount.current = 0;
      nextChoiceTime.current = Math.floor(Math.random() * 
        (OBSTACLE_INTERVAL_MAX - OBSTACLE_INTERVAL_MIN) + OBSTACLE_INTERVAL_MIN);
      
      console.log('🔍 HOUR CHOICES: Next choice in:', nextChoiceTime.current, 'frames');
      
      return true; // Indicate a new choice was spawned
    }
    
    return false; // No new choice was spawned
  }, [gameSpeed, isActive, hourChoices.length]);

  return {
    hourChoices,
    updateHourChoices,
    updateFrame,
    setHourChoices
  };
};
