import { describe, it, expect } from 'vitest';
import { randomNormal } from './Utils';

describe('randomNormal', () => {
  it('should return a number', () => {
    const result = randomNormal(0, 1);
    expect(typeof result).toBe('number');
    expect(isNaN(result)).toBe(false);
  });

  it('should generate numbers around the specified mean', () => {
    const mean = 100;
    const stdDev = 10;
    const results = Array.from({ length: 1000 }, () => randomNormal(mean, stdDev));
    const sampleMean = results.reduce((a, b) => a + b, 0) / results.length;

    // Check if the sample mean is within a reasonable range of the true mean.
    // 4 standard errors (4 * stdDev / sqrt(n)) gives high confidence.
    const threshold = (4 * stdDev) / Math.sqrt(results.length);
    expect(sampleMean).toBeGreaterThan(mean - threshold);
    expect(sampleMean).toBeLessThan(mean + threshold);
  });
});
