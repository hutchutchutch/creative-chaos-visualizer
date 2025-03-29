
import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useModelLoader } from '../hooks/useModelLoader';
import DeskScene from './DeskScene';
import LoadingScreen from './LoadingScreen';
import UIOverlay from './UIOverlay';
import { useNavigate } from 'react-router-dom';

interface CreativeChaosCanvasProps {
  modelPath?: string;
}

const CreativeChaosCanvas: React.FC<CreativeChaosCanvasProps> = ({ 
  modelPath = '/desk3.glb' // Changed to use desk3.glb file
}) => {
  const { model, loadingProgress, error } = useModelLoader(modelPath);
  const [showOverlay, setShowOverlay] = useState(false);
  const navigate = useNavigate();
  
  // Show UI overlay after loading completes
  useEffect(() => {
    if (loadingProgress === 100) {
      const timer = setTimeout(() => {
        setShowOverlay(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [loadingProgress]);
  
  // Log any errors
  useEffect(() => {
    if (error) {
      console.error("Error loading model:", error);
    }
  }, [error]);

  const handleCtaClick = () => {
    navigate('/game');
  };

  return (
    <>
      {/* Show loading screen while model loads */}
      {loadingProgress < 100 && (
        <LoadingScreen progress={loadingProgress} />
      )}
      
      {/* Main 3D canvas */}
      <Canvas 
        shadows 
        dpr={[1, 2]} 
        gl={{ 
          antialias: true,
          logarithmicDepthBuffer: true,
          alpha: false
        }}
        camera={{ position: [0, 2, 6], fov: 45 }}
        style={{ background: '#1A1F2C' }}
      >
        <Suspense fallback={null}>
          <DeskScene modelData={model} />
        </Suspense>
      </Canvas>
      
      {/* UI Overlay with navigation handler */}
      {showOverlay && <UIOverlay onCtaClick={handleCtaClick} />}
    </>
  );
};

export default CreativeChaosCanvas;
