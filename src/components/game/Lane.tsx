
import React from 'react';
import * as THREE from 'three';
import { LANES, LANE_COLORS } from './constants';

interface LaneProps {
  index: number;
}

const Lane = ({ index }: LaneProps) => {
  const color = 
    index === 0 ? LANE_COLORS.happy : 
    index === 1 ? LANE_COLORS.healthy : 
    LANE_COLORS.helpful;
  
  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[LANES[index], -0.49, 0]} 
      receiveShadow
    >
      <planeGeometry args={[LANE_WIDTH * 0.9, 100]} />
      <meshStandardMaterial color={color} opacity={0.7} transparent />
    </mesh>
  );
};

// Export LANE_WIDTH for use in this component
const LANE_WIDTH = 2;
export default Lane;
