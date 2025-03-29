
import { useEffect } from 'react';

interface GameResetParams {
  setGameActive: (active: boolean) => void;
  setCurrentHour: (hour: number) => void;
  setHealth: (health: {happy: number, healthy: number, helpful: number}) => void;
  setHourChoices: (choices: any[]) => void;
  setGameSpeed: (speed: number) => void;
  setDailySchedule: (schedule: string[]) => void;
  resetFrameCounters: () => void;
}

export const useGameReset = ({
  setGameActive,
  setCurrentHour,
  setHealth,
  setHourChoices,
  setGameSpeed,
  setDailySchedule,
  resetFrameCounters
}: GameResetParams) => {
  
  useEffect(() => {
    // Handle game restart
    const handleRestart = () => {
      console.log('Game restarted');
      setGameActive(true);
      setCurrentHour(1);
      setHealth({happy: 5, healthy: 5, helpful: 5});
      setHourChoices([]);
      setGameSpeed(GAME_SPEED_INITIAL);
      setDailySchedule(Array(16).fill(''));
      resetFrameCounters();
      
      window.dispatchEvent(new CustomEvent('score-update', { 
        detail: { score: 0, type: 'set' } 
      }));

      window.dispatchEvent(new CustomEvent('health-update', {
        detail: { health: {happy: 5, healthy: 5, helpful: 5} }
      }));
    };
    
    window.addEventListener('game-restart', handleRestart);
    
    return () => {
      window.removeEventListener('game-restart', handleRestart);
    };
  }, [
    setGameActive, 
    setCurrentHour, 
    setHealth, 
    setHourChoices, 
    setGameSpeed, 
    setDailySchedule, 
    resetFrameCounters
  ]);
  
  const restartGame = () => {
    window.dispatchEvent(new CustomEvent('game-restart'));
  };
  
  return { restartGame };
};

// Import for the hook
import { GAME_SPEED_INITIAL } from '../components/game/constants';
