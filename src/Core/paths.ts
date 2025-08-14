import { Vec2 } from './Types';

/**
 * A record of all predefined enemy paths.
 * Each path is an array of waypoints (Vec2 coordinates).
 */
export const PATHS: Record<string, Vec2[]> = {
  'lane1': [ // Left lane
    [-80, -80], // Start
    [-90, -40],
    [-80, 0],   // Engages the player line
    [-70, 20],  // Goes past the line
  ],
  'lane2': [ // Center lane
    [0, -80],   // Start
    [10, -50],
    [-10, -20],
    [0, 20],    // Goes past the line
  ],
  'lane3': [ // Right lane
    [80, -80],  // Start
    [70, -40],
    [80, 0],    // Engages the player line
    [90, 20],   // Goes past the line
  ],
};
