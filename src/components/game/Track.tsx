
import React from 'react';
import Lane from './Lane';
import LaneHeaders from './LaneHeaders';
import { LANE_WIDTH } from './constants';

const Track = () => {
  return (
    <group>
      {/* Base track */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[10, 100]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* Colored lanes */}
      <Lane index={0} />
      <Lane index={1} />
      <Lane index={2} />
      
      {/* Lane dividers */}
      {[-1, 1].map((offset, i) => (
        <mesh 
          key={i}
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[offset * LANE_WIDTH, -0.48, 0]} 
          receiveShadow
        >
          <planeGeometry args={[0.1, 100]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      ))}
      
      {/* Lane headers */}
      <LaneHeaders />
    </group>
  );
};

export default Track;
