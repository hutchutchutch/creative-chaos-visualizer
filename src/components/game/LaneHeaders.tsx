
import React from 'react';
import { Text } from '@react-three/drei';
import { LANES, LANE_TITLES, LANE_COLORS } from './constants';

const LaneHeaders = () => {
  return (
    <group position={[0, 2.5, -30]}>
      {LANES.map((lane, index) => (
        <group key={index} position={[lane, 0, 0]}>
          <Text
            position={[0, 0, 0]}
            fontSize={1.5}
            color="#333333"
            font="/fonts/Inter-Bold.woff"
            anchorX="center"
            anchorY="middle"
          >
            {LANE_TITLES[index]}
          </Text>
          {/* Lane color indicator */}
          <mesh position={[0, -1.5, 0]}>
            <boxGeometry args={[1.8, 0.5, 0.1]} />
            <meshStandardMaterial color={
              index === 0 ? LANE_COLORS.happy : 
              index === 1 ? LANE_COLORS.healthy : 
              LANE_COLORS.helpful
            } />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export default LaneHeaders;
