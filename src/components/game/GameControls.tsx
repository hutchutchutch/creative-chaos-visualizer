
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Heart, Activity, HelpingHand } from 'lucide-react';
import { LANE_COLORS } from './constants';

const GameControls: React.FC = () => {
  const handleMoveLeft = () => {
    window.dispatchEvent(new CustomEvent('game-move', { detail: { direction: 'left' } }));
  };
  
  const handleMoveRight = () => {
    window.dispatchEvent(new CustomEvent('game-move', { detail: { direction: 'right' } }));
  };

  // Convert THREE.Color to CSS hex format
  const getHexColor = (color: any) => {
    return `#${color.getHexString()}`;
  };

  return (
    <div className="absolute bottom-0 left-0 w-full p-6">
      {/* Mobile controls */}
      <div className="md:hidden flex justify-center gap-10">
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
      
      {/* Lane legend for all devices */}
      <div className="flex justify-center gap-4 mt-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: getHexColor(LANE_COLORS.happy) + '40' }}>
          <Heart className="text-white" size={16} />
          <span className="text-white text-xs font-medium">Happy</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: getHexColor(LANE_COLORS.healthy) + '40' }}>
          <Activity className="text-white" size={16} />
          <span className="text-white text-xs font-medium">Healthy</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: getHexColor(LANE_COLORS.helpful) + '40' }}>
          <HelpingHand className="text-white" size={16} />
          <span className="text-white text-xs font-medium">Helpful</span>
        </div>
      </div>
    </div>
  );
};

export default GameControls;
