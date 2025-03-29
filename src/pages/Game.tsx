
import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import GameScene from '../components/GameScene';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Game = () => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [choices, setChoices] = useState({
    happy: 0,
    healthy: 0,
    helpful: 0
  });
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
      if (e.detail.type === 'set') {
        setScore(e.detail.score);
      } else {
        setScore(prev => prev + e.detail.score);
      }
    };
    
    // Listen for game over event
    const handleGameOver = () => {
      setGameOver(true);
    };
    
    // Listen for choices data
    const handleChoicesUpdate = (e: CustomEvent) => {
      setChoices(e.detail.choices);
    };
    
    window.addEventListener('score-update', handleScoreUpdate as EventListener);
    window.addEventListener('game-over', handleGameOver);
    window.addEventListener('game-choices', handleChoicesUpdate as EventListener);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('score-update', handleScoreUpdate as EventListener);
      window.removeEventListener('game-over', handleGameOver);
      window.removeEventListener('game-choices', handleChoicesUpdate as EventListener);
    };
  }, []);

  const handleRestart = () => {
    setGameOver(false);
    setScore(0);
    setChoices({
      happy: 0,
      healthy: 0,
      helpful: 0
    });
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
        <div className="text-2xl font-bold">Hours Planned: {score}/24</div>
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
          <div className="bg-creative-dark p-8 rounded-lg text-center max-w-md w-full">
            <h2 className="text-4xl font-bold text-white mb-4">Day Complete!</h2>
            <p className="text-xl text-creative-light-purple mb-6">Here's how you planned your day:</p>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-[#D3E4FD] rounded-lg p-4 text-gray-800">
                <h3 className="font-bold text-lg">Happy</h3>
                <p className="text-3xl font-bold">{choices.happy}</p>
                <p className="text-sm">hours</p>
              </div>
              <div className="bg-[#F2FCE2] rounded-lg p-4 text-gray-800">
                <h3 className="font-bold text-lg">Healthy</h3>
                <p className="text-3xl font-bold">{choices.healthy}</p>
                <p className="text-sm">hours</p>
              </div>
              <div className="bg-[#E5DEFF] rounded-lg p-4 text-gray-800">
                <h3 className="font-bold text-lg">Helpful</h3>
                <p className="text-3xl font-bold">{choices.helpful}</p>
                <p className="text-sm">hours</p>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button onClick={handleRestart} className="bg-creative-purple hover:bg-creative-purple/90 px-6 py-2">
                Plan Another Day
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
