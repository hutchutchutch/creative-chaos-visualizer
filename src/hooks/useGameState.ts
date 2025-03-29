
import { useState, useEffect } from 'react';
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
  }, [gameActive]);

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

    // Also dispatch health update event - ensure we're using the updated health value
    window.dispatchEvent(new CustomEvent('health-update', {
      detail: { health }
    }));
  };

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
    handleLaneDecision
  };
};
