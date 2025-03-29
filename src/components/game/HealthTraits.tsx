
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
            <Progress className="h-2 bg-gray-700" value={happyPercent} 
              style={{ color: "#D3E4FD" }} // Light Blue
            />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Healthy</span>
              <span className="text-sm">{healthy.toFixed(1)}/{maxHealth}</span>
            </div>
            <Progress className="h-2 bg-gray-700" value={healthyPercent}
              style={{ color: "#F2FCE2" }} // Light Green
            />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Helpful</span>
              <span className="text-sm">{helpful.toFixed(1)}/{maxHealth}</span>
            </div>
            <Progress className="h-2 bg-gray-700" value={helpfulPercent}
              style={{ color: "#E5DEFF" }} // Light Purple
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthTraits;
