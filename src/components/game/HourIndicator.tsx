
import React from 'react';
import { Text } from '@react-three/drei';

interface HourIndicatorProps {
  currentHour: number;
  totalHours: number;
}

const HourIndicator = ({ currentHour, totalHours = 16 }: HourIndicatorProps) => {
  return (
    <group position={[0, 3.5, -5]}>
      {/* Background plane for better visibility */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[6, 1.5]} />
        <meshBasicMaterial color="#000000" opacity={0.85} transparent />
      </mesh>
      
      {/* Text indicator */}
      <Text 
        position={[0, 0, 0]}
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
