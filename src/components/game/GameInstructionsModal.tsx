
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, HelpCircle, ArrowRight } from 'lucide-react';

interface GameInstructionsModalProps {
  open: boolean;
  onClose: () => void;
  onStart: () => void;
}

const GameInstructionsModal: React.FC<GameInstructionsModalProps> = ({
  open,
  onClose,
  onStart
}) => {
  const handleStart = () => {
    console.log("🔍 Got it button clicked, calling onStart and onClose...");
    // Ensure we close the modal first and then start the game
    onClose(); // Close the modal
    // Delay starting the game slightly to ensure modal is closed first
    setTimeout(() => {
      onStart(); // Start the game after a slight delay
      console.log("🔍 Starting game after modal close");
    }, 100);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        console.log("🔍 Dialog closed via X button, calling onClose...");
        onClose(); // Only call onClose when dialog is closed via X button
        // Remove the onStart() call here to prevent duplicate game start
      }
    }}>
      <DialogContent className="bg-creative-dark border-creative-purple text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <HelpCircle className="text-creative-purple" />
            How to Play Your Daily Schedule Game
          </DialogTitle>
          <DialogDescription className="text-creative-light-purple text-center text-lg">
            Plan your ideal day by balancing happiness, health, and helpfulness
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="flex items-start gap-3">
            <div className="bg-[#4285F4] rounded p-2 text-white">
              <ArrowRight size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-white">Choose Your Activities</h3>
              <p className="text-creative-light-purple">Use left/right arrow keys or on-screen buttons to move between lanes.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-[#34A853] rounded p-2 text-white">
              <ArrowRight size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-white">Collect Activities</h3>
              <p className="text-creative-light-purple">Catch activity blocks to fill your 16-hour schedule (7am-11pm).</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-[#8B5CF6] rounded p-2 text-white">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-white">Generate Your Schedule</h3>
              <p className="text-creative-light-purple">After planning your full day, you'll be able to export to Google Calendar!</p>
            </div>
          </div>
        </div>
        
        <div className="bg-black/30 p-4 rounded-lg text-sm">
          <span className="text-white font-semibold">Lane Colors:</span><br />
          <span className="text-[#4285F4] font-semibold">Blue Lane</span>: Happy activities for enjoyment<br />
          <span className="text-[#34A853] font-semibold">Green Lane</span>: Healthy activities for wellbeing<br />
          <span className="text-[#8B5CF6] font-semibold">Purple Lane</span>: Helpful activities for productivity
        </div>
        
        <DialogFooter>
          <Button onClick={handleStart} className="w-full bg-creative-purple hover:bg-creative-purple/90">
            Got it! Let's Plan My Day
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GameInstructionsModal;
