
import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import GameScene, { GameSceneHandle } from '../components/GameScene';
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
  
  // Force the game to start when the component mounts
  useEffect(() => {
    console.log("🔍 GAME MOUNT: Component mounted, forcing game to start");
    // Set a timeout to ensure the component is fully mounted
    setTimeout(() => {
      setGameStarted(true);
      console.log("🔍 GAME MOUNT: Set gameStarted to true");
    }, 500);
  }, []);

  // Function to close the instructions modal
  const closeInstructions = () => {
    console.log("🔍 closeInstructions called in Game.tsx");
    setShowInstructions(false);
  };

  // Get the forceGameStart method from the GameScene component
  const forceGameStartRef = useRef<GameSceneHandle>(null);
  
  const startGame = () => {
    console.log("🔍 GAME: startGame called in Game.tsx, gameStarted:", gameStarted);
    // Force close the instructions modal first
    setShowInstructions(false);
    
    if (!gameStarted) { // Only start the game if it hasn't been started yet
      console.log("🔍 GAME: Setting gameStarted to true and gameOver to false");
      setGameStarted(true);
      setGameOver(false);
      
      // Try to use the direct method if available
      if (forceGameStartRef.current) {
        console.log("🔍 GAME: Using direct forceGameStart method");
        forceGameStartRef.current.forceGameStart();
      } else {
        console.log("🔍 GAME: forceGameStart method not available, using events");
        
        // Dispatch event after state updates with a longer timeout to ensure state updates have propagated
        setTimeout(() => {
          console.log("🔍 GAME: About to dispatch game-start event");
          
          // Create a custom event with a unique identifier
          const startEvent = new CustomEvent('game-start', { 
            detail: { timestamp: Date.now() } 
          });
          
          // Dispatch the event
          window.dispatchEvent(startEvent);
          console.log("🔍 GAME: game-start event dispatched with timestamp:", startEvent.detail.timestamp);
          
          // Double-check that the event was dispatched by dispatching it again after a short delay
          setTimeout(() => {
            console.log("🔍 GAME: Dispatching game-start event again to ensure it's received");
            window.dispatchEvent(new CustomEvent('game-start', { 
              detail: { timestamp: Date.now(), retry: true } 
            }));
            
            // Try a third time with a different event name
            setTimeout(() => {
              console.log("🔍 GAME: Dispatching game-active-force event as a fallback");
              window.dispatchEvent(new CustomEvent('game-active-force', { 
                detail: { timestamp: Date.now() } 
              }));
            }, 100);
          }, 100);
        }, 50);
      }
    } else {
      console.log("🔍 GAME: Game already started, skipping duplicate start");
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
        <GameScene 
          ref={forceGameStartRef}
          forceGameActive={gameStarted} 
        />
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

      {/* Instructions modal - only render when showInstructions is true */}
      {showInstructions && (
        <GameInstructionsModal
          open={true}
          onClose={closeInstructions}
          onStart={startGame}
        />
      )}
    </div>
  );
};

export default Game;
