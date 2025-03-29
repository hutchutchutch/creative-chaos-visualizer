
import React from 'react';

interface LoadingScreenProps {
  progress: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress }) => {
  return (
    <div className="fixed inset-0 bg-creative-dark flex flex-col items-center justify-center z-50">
      <div className="loader mb-6">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <h2 className="text-creative-purple text-xl font-medium mb-4">Loading Your Creative Space</h2>
      <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-creative-purple rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-creative-light-purple mt-2">{Math.round(progress)}%</p>
    </div>
  );
};

export default LoadingScreen;
