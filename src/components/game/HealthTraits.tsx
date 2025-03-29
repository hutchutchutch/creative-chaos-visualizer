
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface HealthTraitsProps {
  happy: number;
  healthy: number;
  helpful: number;
}

const HealthTraits = ({ happy, healthy, helpful }: HealthTraitsProps) => {
  // Convert values to percentages (0-100 scale for Progress component)
  // We'll assume max health is 10 for this implementation
  const maxHealth = 10;
  const happyPercent = Math.min(100, Math.max(0, (happy / maxHealth) * 100));
  const healthyPercent = Math.min(100, Math.max(0, (healthy / maxHealth) * 100));
  const helpfulPercent = Math.min(100, Math.max(0, (helpful / maxHealth) * 100));

  return (
    <Card className="absolute bottom-4 right-4 w-64 bg-black/60 border-gray-700 text-white">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Happy</span>
              <span className="text-sm">{happy.toFixed(1)}/{maxHealth}</span>
            </div>
            <Progress 
              className="h-2 bg-gray-700" 
              value={happyPercent} 
              // Fixed styling to directly apply background color to the indicator
              style={{ "--progress-foreground": "#D3E4FD" } as React.CSSProperties}
            />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Healthy</span>
              <span className="text-sm">{healthy.toFixed(1)}/{maxHealth}</span>
            </div>
            <Progress 
              className="h-2 bg-gray-700" 
              value={healthyPercent}
              // Fixed styling to directly apply background color to the indicator
              style={{ "--progress-foreground": "#F2FCE2" } as React.CSSProperties}
            />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Helpful</span>
              <span className="text-sm">{helpful.toFixed(1)}/{maxHealth}</span>
            </div>
            <Progress 
              className="h-2 bg-gray-700" 
              value={helpfulPercent}
              // Fixed styling to directly apply background color to the indicator
              style={{ "--progress-foreground": "#E5DEFF" } as React.CSSProperties}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthTraits;
