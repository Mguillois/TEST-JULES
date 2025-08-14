import { Vec2 } from './Types';

/**
 * A record of all predefined enemy paths.
 * Each path is an array of waypoints (Vec2 coordinates).
 */
export const PATHS: Record<string, Vec2[]> = {
  'lane1': [ // Left lane
    [-40, -40], // Start
    [-45, -20],
    [-40, 0],   // Engages the player line
    [-35, 10],  // Goes past the line
  ],
  'lane2': [ // Center lane
    [0, -40],   // Start
    [5, -25],
    [-5, -10],
    [0, 10],    // Goes past the line
  ],
  'lane3': [ // Right lane
    [40, -40],  // Start
    [35, -20],
    [40, 0],    // Engages the player line
    [45, 10],   // Goes past the line
  ],
};
