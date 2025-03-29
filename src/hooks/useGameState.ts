
import { useState, useEffect, useCallback } from 'react';
import { GAME_SPEED_INITIAL, GAME_SPEED_INCREMENT } from '../components/game/constants';

export interface GameState {
  playerLane: number;
  gameSpeed: number;
  health: {
    happy: number;
    healthy: number;
    helpful: number;
  };
  gameActive: boolean;
  currentHour: number;
  dailySchedule: string[];
}

export const useGameState = () => {
  const [playerLane, setPlayerLane] = useState(1); // Start in middle lane (index 1)
  const [gameSpeed, setGameSpeed] = useState(GAME_SPEED_INITIAL);
  const [health, setHealth] = useState<{happy: number, healthy: number, helpful: number}>({
    happy: 5, // Start with mid-level health
    healthy: 5,
    helpful: 5
  });
  const [gameActive, setGameActive] = useState(false); // Start with game paused
  const [currentHour, setCurrentHour] = useState(1);
  const [dailySchedule, setDailySchedule] = useState<string[]>(Array(16).fill(''));

  // Add an effect to log when gameActive changes
  useEffect(() => {
    console.log("🔍 useGameState: gameActive changed to:", gameActive);
    
    // If gameActive is true, dispatch a notification
    if (gameActive) {
      console.log("🔍 useGameState: Game is now active, dispatching game-active-changed event");
      window.dispatchEvent(new CustomEvent('game-active-changed', { detail: { active: true } }));
    }
  }, [gameActive]);
  
  // Listen for game-start event - IMPORTANT: Remove gameActive from dependency array
  useEffect(() => {
    console.log("🔍 SETUP: Setting up game-start event listener in useGameState");
    
    const handleGameStart = () => {
      console.log("🔍 HANDLER: useGameState received game-start event, setting gameActive to true");
      console.log("🔍 HANDLER: gameActive before:", gameActive);
      
      // Try to directly set gameActive to true
      setGameActive(true);
      console.log("🔍 HANDLER: Called setGameActive(true)");
      
      // Force update gameActive with a direct call to ensure it's set
      setTimeout(() => {
        console.log("🔍 HANDLER TIMEOUT: useGameState checking gameActive after timeout:", gameActive);
        if (!gameActive) {
          console.log("🔍 HANDLER TIMEOUT: gameActive still false after timeout, forcing update");
          setGameActive(true);
          console.log("🔍 HANDLER TIMEOUT: Called setGameActive(true) again");
        }
      }, 100);
    };
    
    // Also listen for the force event
    const handleForceActive = () => {
      console.log("🔍 FORCE: useGameState received game-active-force event, forcing gameActive to true");
      setGameActive(true);
    };
    
    console.log("🔍 SETUP: useGameState current gameActive:", gameActive);
    window.addEventListener('game-start', handleGameStart);
    window.addEventListener('game-active-force', handleForceActive);
    
    // Also listen for the test event to verify event handling
    const handleTestEvent = () => {
      console.log("🔍 TEST: useGameState test event received, event system is working");
    };
    window.addEventListener('test-event', handleTestEvent);
    
    // Try dispatching a test event to verify the event system
    console.log("🔍 SETUP: useGameState dispatching test-event-2");
    window.dispatchEvent(new CustomEvent('test-event-2'));
    
    return () => {
      console.log("🔍 CLEANUP: Cleaning up event listeners in useGameState");
      window.removeEventListener('game-start', handleGameStart);
      window.removeEventListener('game-active-force', handleForceActive);
      window.removeEventListener('test-event', handleTestEvent);
    };
  }, []); // Remove gameActive from dependency array to prevent re-registering the event listener

  // Debug info - log important game state every few seconds
  useEffect(() => {
    console.log('🔍 GameState initialized with:', { 
      playerLane, 
      gameSpeed, 
      health, 
      gameActive, 
      currentHour 
    });
    
    const debugInterval = setInterval(() => {
      console.log('Game state:', {
        playerLane,
        gameSpeed,
        currentHour
      });
    }, 5000);
    
    return () => clearInterval(debugInterval);
  }, [playerLane, gameSpeed, currentHour]);

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

  const updateGameSpeed = () => {
    setGameSpeed(prev => prev + GAME_SPEED_INCREMENT);
  };

  const handleLaneDecision = (laneIdx: number) => {
    // Only process lane decisions if the game is active
    if (!gameActive) {
      console.log('Lane decision ignored - game not active');
      return;
    }
    
    console.log('Lane decision made:', { laneIdx, currentHour });
    
    // Record the choice for the daily schedule
    const newSchedule = [...dailySchedule];
    newSchedule[currentHour - 1] = laneIdx === 0 ? "Happy" : laneIdx === 1 ? "Healthy" : "Helpful";
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

    // Also dispatch health update event - use a timeout to ensure we get the updated health
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('health-update', {
        detail: { health }
      }));
    }, 10);
  };

  // Add a direct method to force the game to start
  const forceGameStart = useCallback(() => {
    console.log("🔍 DIRECT: Forcing game to start directly");
    
    // Set gameActive to true directly
    setGameActive(true);
    
    // Dispatch a notification that the game has been forced to start
    window.dispatchEvent(new CustomEvent('game-active-changed', { 
      detail: { active: true, forced: true } 
    }));
    
    // Log the current state
    console.log("🔍 DIRECT: Game state after force start:", {
      gameActive: true,
      playerLane,
      gameSpeed,
      currentHour
    });
    
    // Force a re-render by dispatching a custom event
    window.dispatchEvent(new CustomEvent('game-active-force', { 
      detail: { timestamp: Date.now() } 
    }));
    
    // Try again after a short delay to ensure it's set
    setTimeout(() => {
      console.log("🔍 DIRECT TIMEOUT: Forcing game to start again");
      setGameActive(true);
      
      // Dispatch another event
      window.dispatchEvent(new CustomEvent('game-active-force', { 
        detail: { timestamp: Date.now(), retry: true } 
      }));
    }, 100);
  }, [playerLane, gameSpeed, currentHour]);

  return {
    playerLane,
    setPlayerLane,
    gameSpeed,
    setGameSpeed,
    health,
    setHealth,
    gameActive,
    setGameActive,
    currentHour,
    setCurrentHour,
    dailySchedule,
    setDailySchedule,
    updateGameSpeed,
    handleLaneDecision,
    forceGameStart // Export the new method
  };
};
