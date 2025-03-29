
import { useEffect } from 'react';
import { LANES } from '../components/game/constants';

export const usePlayerControls = (
  playerLane: number, 
  setPlayerLane: (lane: number) => void,
  gameActive: boolean
) => {
  
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
    
    window.addEventListener('game-move', handleMove as EventListener);
    
    return () => {
      window.removeEventListener('game-move', handleMove as EventListener);
    };
  }, [playerLane, gameActive, setPlayerLane]);

  // Return player position for camera
  const getPlayerPosition = () => {
    return LANES[playerLane];
  };

  return {
    getPlayerPosition
  };
};
