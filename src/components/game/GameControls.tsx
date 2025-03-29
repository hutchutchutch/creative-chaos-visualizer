
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const GameControls: React.FC = () => {
  const handleMoveLeft = () => {
    window.dispatchEvent(new CustomEvent('game-move', { detail: { direction: 'left' } }));
  };
  
  const handleMoveRight = () => {
    window.dispatchEvent(new CustomEvent('game-move', { detail: { direction: 'right' } }));
  };

  return (
    <div className="md:hidden absolute bottom-10 left-0 w-full flex justify-center gap-10">
      <Button 
        className="h-16 w-16 rounded-full bg-creative-purple/80 hover:bg-creative-purple"
        onClick={handleMoveLeft}
      >
        <ArrowLeft size={30} />
      </Button>
      <Button 
        className="h-16 w-16 rounded-full bg-creative-purple/80 hover:bg-creative-purple"
        onClick={handleMoveRight}
      >
        <ArrowRight size={30} />
      </Button>
    </div>
  );
};

export default GameControls;
