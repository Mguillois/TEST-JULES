/**
 * Generates a random number from a standard normal distribution (mean 0, stdDev 1).
 * Uses the Box-Muller transform.
 */
function randomStandardNormal(): number {
  let u1 = 0, u2 = 0;
  // Convert [0,1) to (0,1)
  while (u1 === 0) u1 = Math.random();
  while (u2 === 0) u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0;
}

/**
 * Generates a random number from a normal distribution with a specified mean and standard deviation.
 * @param mean The mean of the distribution.
 * @param stdDev The standard deviation of the distribution.
 * @returns A random number.
 */
export function randomNormal(mean: number, stdDev: number): number {
  return mean + randomStandardNormal() * stdDev;
}
