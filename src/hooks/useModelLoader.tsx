
import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export interface ModelData {
  scene: THREE.Group | null;
  animations?: THREE.AnimationClip[];
}

export const useModelLoader = (modelPath: string) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [model, setModel] = useState<ModelData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    // Set up DRACO loader for compression
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

    // Set up GLTF loader with DRACO support
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    // Load the model
    gltfLoader.load(
      modelPath,
      (gltf: GLTF) => {
        if (isMounted) {
          setModel({
            scene: gltf.scene,
            animations: gltf.animations
          });
          setLoadingProgress(100);
        }
      },
      (progress) => {
        if (isMounted) {
          const percentage = (progress.loaded / progress.total) * 100;
          setLoadingProgress(Math.min(percentage, 99)); // Cap at 99% until fully loaded
        }
      },
      (err) => {
        if (isMounted) {
          console.error('Error loading model:', err);
          // Fix: Type error by ensuring we're setting a proper Error object
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      }
    );

    return () => {
      isMounted = false;
      dracoLoader.dispose();
    };
  }, [modelPath]);

  return { model, loadingProgress, error };
};
