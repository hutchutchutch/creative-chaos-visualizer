
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import GameScene from '../components/GameScene';
import HealthTraits from '../components/game/HealthTraits';
import GameControls from '../components/game/GameControls';
import GameOverlay from '../components/game/GameOverlay';
import GameInstructionsModal from '../components/game/GameInstructionsModal';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Game = () => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [health, setHealth] = useState({
    happy: 5,
    healthy: 5,
    helpful: 5
  });
  const [schedule, setSchedule] = useState<string[]>(Array(16).fill(''));
  const [showInstructions, setShowInstructions] = useState(true);
  const [gameStarted, setGameStarted] = useState(false); // Track if game has been started
  const navigate = useNavigate();

  const startGame = () => {
    console.log("🔍 startGame called in Game.tsx, dispatching game-start event...");
    if (!gameStarted) { // Only start the game if it hasn't been started yet
      setGameStarted(true);
      setGameOver(false);
      // Dispatch event after state updates
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('game-start'));
        console.log("🔍 game-start event dispatched after state updates");
      }, 0);
    } else {
      console.log("🔍 Game already started, skipping duplicate start");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        window.dispatchEvent(new CustomEvent('game-move', { detail: { direction: 'left' } }));
      } else if (e.key === 'ArrowRight') {
        window.dispatchEvent(new CustomEvent('game-move', { detail: { direction: 'right' } }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    const handleScoreUpdate = (e: CustomEvent) => {
      if (e.detail.type === 'set') {
        setScore(e.detail.score);
      } else {
        setScore(prev => prev + e.detail.score);
      }
    };
    
    const handleHealthUpdate = (e: CustomEvent) => {
      if (e.detail.health) {
        setHealth(e.detail.health);
      }
    };
    
    const handleGameOver = () => {
      setGameOver(true);
      setGameStarted(false); // Reset game started state when game is over
    };
    
    const handleChoicesUpdate = (e: CustomEvent) => {
      if (e.detail.health) {
        setHealth(e.detail.health);
      }
      if (e.detail.schedule) {
        setSchedule(e.detail.schedule);
      }
    };
    
    const handleGameStart = () => {
      console.log("🔍 Game-start event received in Game.tsx");
      setGameStarted(true);
    };
    
    window.addEventListener('score-update', handleScoreUpdate as EventListener);
    window.addEventListener('health-update', handleHealthUpdate as EventListener);
    window.addEventListener('game-over', handleGameOver);
    window.addEventListener('game-choices', handleChoicesUpdate as EventListener);
    window.addEventListener('game-start', handleGameStart);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('score-update', handleScoreUpdate as EventListener);
      window.removeEventListener('health-update', handleHealthUpdate as EventListener);
      window.removeEventListener('game-over', handleGameOver);
      window.removeEventListener('game-choices', handleChoicesUpdate as EventListener);
      window.removeEventListener('game-start', handleGameStart);
    };
  }, []);

  const handleRestart = () => {
    setGameOver(false);
    setScore(0);
    setHealth({
      happy: 5,
      healthy: 5,
      helpful: 5
    });
    setSchedule(Array(16).fill(''));
    setGameStarted(false);
    window.dispatchEvent(new CustomEvent('game-restart'));
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="relative w-full h-screen bg-creative-dark overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 2, 5], fov: 60 }}
        style={{ background: '#1A1F2C' }}
      >
        <GameScene />
      </Canvas>

      <div className="absolute top-0 left-0 w-full p-4 text-white flex justify-between items-center">
        <Button 
          variant="secondary" 
          onClick={handleBackToHome} 
          className="bg-white text-black hover:bg-gray-200 font-bold"
        >
          Back to Home
        </Button>
        <div className="text-2xl font-bold">Hours Planned: {score}/16</div>
      </div>

      {!gameOver && <HealthTraits happy={health.happy} healthy={health.healthy} helpful={health.helpful} />}

      {/* Game controls for mobile */}
      <GameControls />

      {/* Game over overlay */}
      <GameOverlay 
        gameOver={gameOver}
        health={health}
        schedule={schedule}
        onRestart={handleRestart}
      />

      {/* Instructions modal */}
      <GameInstructionsModal
        open={showInstructions}
        onClose={() => setShowInstructions(false)}
        onStart={startGame}
      />
    </div>
  );
};

export default Game;
