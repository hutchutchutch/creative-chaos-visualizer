
import React from 'react';
import { Text } from '@react-three/drei';

interface HourIndicatorProps {
  currentHour: number;
  totalHours: number;
}

const HourIndicator = ({ currentHour, totalHours = 16 }: HourIndicatorProps) => {
  return (
    <group>
      {/* Background plane for better visibility */}
      <mesh position={[0, 3.5, -5.01]}>
        <planeGeometry args={[6, 1.5]} />
        <meshBasicMaterial color="#000000" opacity={0.8} transparent />
      </mesh>
      
      {/* Text indicator */}
      <Text 
        position={[0, 3.5, -5]}
        fontSize={1.2}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {`Hour ${currentHour} of ${totalHours}`}
      </Text>
    </group>
  );
};

export default HourIndicator;
