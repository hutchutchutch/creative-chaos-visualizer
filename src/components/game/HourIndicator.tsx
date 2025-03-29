
import React from 'react';
import { Text } from '@react-three/drei';

interface HourIndicatorProps {
  currentHour: number;
  totalHours: number;
}

const HourIndicator = ({ currentHour, totalHours = 16 }: HourIndicatorProps) => {
  return (
    <Text 
      position={[0, 3.5, -10]}
      fontSize={1.2}
      color="#FFFFFF"
      anchorX="center"
      anchorY="middle"
    >
      {`Hour ${currentHour} of ${totalHours}`}
    </Text>
  );
};

export default HourIndicator;
