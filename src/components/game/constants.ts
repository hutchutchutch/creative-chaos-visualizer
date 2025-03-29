
import * as THREE from 'three';

// Lane configuration
export const LANE_WIDTH = 2;
export const LANES = [-LANE_WIDTH, 0, LANE_WIDTH]; // Left, Middle, Right
export const LANE_COLORS = {
  happy: new THREE.Color("#4285F4"), // Bright blue
  healthy: new THREE.Color("#34A853"), // Bright green
  helpful: new THREE.Color("#8B5CF6")  // Vivid purple
};
export const LANE_TITLES = ["Happy", "Healthy", "Helpful"];

// Game constants
export const GAME_SPEED_INITIAL = 0.1;
export const GAME_SPEED_INCREMENT = 0.0001;
export const OBSTACLE_INTERVAL_MIN = 60;
export const OBSTACLE_INTERVAL_MAX = 100;
