
import React from 'react';
import { Text } from '@react-three/drei';

interface HourIndicatorProps {
  currentHour: number;
  totalHours: number;
}

const HourIndicator = ({ currentHour, totalHours = 16 }: HourIndicatorProps) => {
  return (
    <Text 
      position={[0, 3.5, -5]} // Moved closer to the camera
      fontSize={1.2}
      color="#FFFFFF"
      anchorX="center"
      anchorY="middle"
      backgroundColor="#00000080" // Added semi-transparent background
      padding={0.5} // Added padding for better visibility
      fontWeight="bold" // Made text bold
    >
      {`Hour ${currentHour} of ${totalHours}`}
    </Text>
  );
};

export default HourIndicator;
