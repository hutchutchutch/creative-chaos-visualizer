
import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useModelLoader } from '../hooks/useModelLoader';
import DeskScene from './DeskScene';
import LoadingScreen from './LoadingScreen';
import UIOverlay from './UIOverlay';

interface CreativeChaosCanvasProps {
  modelPath?: string;
}

const CreativeChaosCanvas: React.FC<CreativeChaosCanvasProps> = ({ 
  modelPath = '/models/desk-scene.glb' // This will be replaced with your actual model path
}) => {
  const { loadingProgress } = useModelLoader(modelPath);
  const [showOverlay, setShowOverlay] = useState(false);
  
  // Show UI overlay after loading completes
  useEffect(() => {
    if (loadingProgress === 100) {
      const timer = setTimeout(() => {
        setShowOverlay(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [loadingProgress]);
  
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
          <DeskScene />
        </Suspense>
      </Canvas>
      
      {/* UI Overlay */}
      {showOverlay && <UIOverlay />}
    </>
  );
};

export default CreativeChaosCanvas;
