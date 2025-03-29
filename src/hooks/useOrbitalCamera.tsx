
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useSpring } from '@react-spring/three';

interface OrbitalCameraProps {
  radius?: number;
  height?: number;
  speed?: number;
  target?: THREE.Vector3;
  damping?: number;
}

export const useOrbitalCamera = ({
  radius = 5,
  height = 1.5,
  speed = 0.05,
  target = new THREE.Vector3(0, 0, 0),
  damping = 0.05,
}: OrbitalCameraProps = {}) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const time = useRef(0);
  const lastPosition = useRef(new THREE.Vector3());
  const verticalOffset = useRef(0);

  // Use this function to smoothly look at a target
  const smoothLookAt = (camera: THREE.PerspectiveCamera, targetPosition: THREE.Vector3) => {
    // Create a temporary vector to store current camera direction
    const currentDir = new THREE.Vector3();
    camera.getWorldDirection(currentDir);
    
    // Calculate desired direction to target
    const desiredDir = new THREE.Vector3().subVectors(targetPosition, camera.position).normalize();
    
    // Interpolate between current and desired direction
    const interpolatedDir = new THREE.Vector3().copy(currentDir).lerp(desiredDir, damping);
    interpolatedDir.normalize();
    
    // Calculate the new up vector to maintain camera orientation
    const up = new THREE.Vector3(0, 1, 0);
    
    // Use lookAt with the interpolated direction
    const lookAtPos = new THREE.Vector3().copy(camera.position).add(interpolatedDir);
    camera.lookAt(lookAtPos);
    
    // Manually set up vector to avoid rolling
    camera.up.copy(up);
  };

  useFrame((_, delta) => {
    if (!cameraRef.current) return;

    // Update the time reference for continuous animation
    time.current += delta * speed;

    // Calculate the new camera position in a circular path
    const angle = time.current % (Math.PI * 2);
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;

    // Add a gentle vertical oscillation
    verticalOffset.current = Math.sin(time.current * 0.5) * 0.2;
    const y = height + verticalOffset.current;

    // Create a new position vector
    const newPosition = new THREE.Vector3(x, y, z);

    // Smoothly interpolate to the new position for damping effect
    cameraRef.current.position.lerp(newPosition, damping);

    // Smooth look at the target
    smoothLookAt(cameraRef.current, target);

    // Store the current position for next frame
    lastPosition.current.copy(cameraRef.current.position);
  });

  return cameraRef;
};
