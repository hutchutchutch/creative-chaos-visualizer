
import * as THREE from 'three';

// Lane configuration
export const LANE_WIDTH = 2;
export const LANES = [-LANE_WIDTH, 0, LANE_WIDTH]; // Left, Middle, Right
export const LANE_COLORS = {
  happy: new THREE.Color("#D3E4FD"), // Light Blue
  healthy: new THREE.Color("#F2FCE2"), // Light Green
  helpful: new THREE.Color("#E5DEFF")  // Light Purple
};
export const LANE_TITLES = ["Happy", "Healthy", "Helpful"];

// Game constants
export const GAME_SPEED_INITIAL = 0.1;
export const GAME_SPEED_INCREMENT = 0.0001;
export const OBSTACLE_INTERVAL_MIN = 60;
export const OBSTACLE_INTERVAL_MAX = 100;
