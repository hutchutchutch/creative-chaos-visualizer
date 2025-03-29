
import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const Background = () => {
  const { scene } = useGLTF('/desk3.glb');
  const deskRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (scene && deskRef.current) {
      // Clone and add the desk model
      const deskScene = scene.clone();
      deskScene.scale.set(0.5, 0.5, 0.5);
      deskScene.position.set(0, 0, -50);
      deskScene.rotation.y = Math.PI;
      deskRef.current.add(deskScene);
    }
  }, [scene]);
  
  return (
    <>
      {/* Background desk model */}
      <group ref={deskRef} />
      
      {/* Sky */}
      <mesh position={[0, 0, -100]}>
        <planeGeometry args={[200, 100]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
    </>
  );
};

export default Background;
