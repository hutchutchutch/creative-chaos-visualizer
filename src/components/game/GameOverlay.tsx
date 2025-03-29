
import React from 'react';
import { Button } from '@/components/ui/button';
import DailyCalendar from './DailyCalendar';
import { useNavigate } from 'react-router-dom';

interface GameOverlayProps {
  gameOver: boolean;
  health: {
    happy: number;
    healthy: number;
    helpful: number;
  };
  schedule: string[];
  onRestart: () => void;
}

const GameOverlay: React.FC<GameOverlayProps> = ({ 
  gameOver, 
  health, 
  schedule, 
  onRestart 
}) => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  if (!gameOver) return null;

  return (
    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
      <div className="bg-creative-dark p-8 rounded-lg text-center max-w-xl w-full">
        <h2 className="text-4xl font-bold text-white mb-4">Day Complete!</h2>
        <p className="text-xl text-creative-light-purple mb-6">Here's how you planned your day:</p>
        
        <div className="mb-6">
          <DailyCalendar schedule={schedule} />
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#4285F4] rounded-lg p-4 text-white">
            <h3 className="font-bold text-lg">Happy</h3>
            <p className="text-3xl font-bold">{health.happy.toFixed(1)}</p>
            <p className="text-sm">health</p>
          </div>
          <div className="bg-[#34A853] rounded-lg p-4 text-white">
            <h3 className="font-bold text-lg">Healthy</h3>
            <p className="text-3xl font-bold">{health.healthy.toFixed(1)}</p>
            <p className="text-sm">health</p>
          </div>
          <div className="bg-[#8B5CF6] rounded-lg p-4 text-white">
            <h3 className="font-bold text-lg">Helpful</h3>
            <p className="text-3xl font-bold">{health.helpful.toFixed(1)}</p>
            <p className="text-sm">health</p>
          </div>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Button onClick={onRestart} className="bg-creative-purple hover:bg-creative-purple/90 px-6 py-2">
            Plan Another Day
          </Button>
          <Button 
            variant="outline" 
            onClick={handleBackToHome} 
            className="bg-black/50 text-white border-white hover:bg-black/80"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameOverlay;
