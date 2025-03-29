
import React from 'react';

const Lighting = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.0} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024} 
      />
      <spotLight 
        position={[-5, 8, 5]} 
        angle={0.5} 
        penumbra={0.8} 
        intensity={1.5} 
        castShadow 
        color="#9b87f5" 
      />
    </>
  );
};

export default Lighting;
