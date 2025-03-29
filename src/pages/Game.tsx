
import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import GameScene from '../components/GameScene';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Game = () => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const navigate = useNavigate();

  // Handle key presses for game controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        window.dispatchEvent(new CustomEvent('game-move', { detail: { direction: 'left' } }));
      } else if (e.key === 'ArrowRight') {
        window.dispatchEvent(new CustomEvent('game-move', { detail: { direction: 'right' } }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Listen for score updates
    const handleScoreUpdate = (e: CustomEvent) => {
      setScore(e.detail.score);
    };
    
    // Listen for game over event
    const handleGameOver = () => {
      setGameOver(true);
    };
    
    window.addEventListener('score-update', handleScoreUpdate as EventListener);
    window.addEventListener('game-over', handleGameOver);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('score-update', handleScoreUpdate as EventListener);
      window.removeEventListener('game-over', handleGameOver);
    };
  }, []);

  const handleRestart = () => {
    setGameOver(false);
    setScore(0);
    window.dispatchEvent(new CustomEvent('game-restart'));
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="relative w-full h-screen bg-creative-dark overflow-hidden">
      {/* Game Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 2, 5], fov: 60 }}
        style={{ background: '#1A1F2C' }}
      >
        <GameScene />
      </Canvas>

      {/* Game HUD */}
      <div className="absolute top-0 left-0 w-full p-4 text-white flex justify-between items-center">
        <Button variant="outline" onClick={handleBackToHome} className="text-white border-white">
          Back to Home
        </Button>
        <div className="text-2xl font-bold">Score: {score}</div>
      </div>

      {/* Mobile Controls */}
      <div className="md:hidden absolute bottom-10 left-0 w-full flex justify-center gap-10">
        <Button 
          className="h-16 w-16 rounded-full bg-creative-purple/80 hover:bg-creative-purple"
          onClick={() => window.dispatchEvent(new CustomEvent('game-move', { detail: { direction: 'left' } }))}
        >
          <ArrowLeft size={30} />
        </Button>
        <Button 
          className="h-16 w-16 rounded-full bg-creative-purple/80 hover:bg-creative-purple"
          onClick={() => window.dispatchEvent(new CustomEvent('game-move', { detail: { direction: 'right' } }))}
        >
          <ArrowRight size={30} />
        </Button>
      </div>

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
          <div className="bg-creative-dark p-8 rounded-lg text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Game Over</h2>
            <p className="text-2xl text-creative-light-purple mb-8">Final Score: {score}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={handleRestart} className="bg-creative-purple hover:bg-creative-purple/90 px-6 py-2">
                Play Again
              </Button>
              <Button variant="outline" onClick={handleBackToHome} className="border-white text-white">
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
