
import { useEffect, useState } from 'react';
import { LANES } from '../components/game/constants';

export const usePlayerControls = (
  playerLane: number, 
  setPlayerLane: (lane: number) => void,
  gameActive: boolean
) => {
  const [isMoving, setIsMoving] = useState(false);
  const [moveDirection, setMoveDirection] = useState<'left' | 'right' | null>(null);
  
  useEffect(() => {
    // Handle player movement
    const handleMove = (e: CustomEvent) => {
      if (!gameActive) return;
      
      const direction = e.detail.direction as 'left' | 'right';
      
      const newLane = direction === 'left' && playerLane > 0 
        ? playerLane - 1 
        : direction === 'right' && playerLane < 2 
        ? playerLane + 1 
        : playerLane;
      
      if (newLane !== playerLane) {
        console.log('Player moved to lane:', newLane, 'direction:', direction);
        setMoveDirection(direction);
        setIsMoving(true);
        setPlayerLane(newLane);
        
        // Reset moving state after transition completes
        setTimeout(() => {
          setIsMoving(false);
          setMoveDirection(null);
        }, 300);
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
    getPlayerPosition,
    isMoving,
    moveDirection
  };
};
