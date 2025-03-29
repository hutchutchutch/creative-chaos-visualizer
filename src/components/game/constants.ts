
import * as THREE from 'three';

// Lane configuration
export const LANE_WIDTH = 2;
export const LANES = [-LANE_WIDTH, 0, LANE_WIDTH]; // Left, Middle, Right
export const LANE_COLORS = {
  happy: new THREE.Color("#FF6B6B"),    // Vibrant red for Happy
  healthy: new THREE.Color("#4ECB71"),  // Bright green for Healthy
  helpful: new THREE.Color("#4E8EFF")   // Bright blue for Helpful
};
export const LANE_TITLES = ["Happy", "Healthy", "Helpful"];

// Game constants
export const GAME_SPEED_INITIAL = 0.2;  // Initial speed
export const GAME_SPEED_INCREMENT = 0.001; // Increased increment for more dynamic gameplay
export const OBSTACLE_INTERVAL_MIN = 40; // Shorter intervals between obstacles
export const OBSTACLE_INTERVAL_MAX = 80; // Shorter intervals between obstacles
