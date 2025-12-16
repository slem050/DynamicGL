import { normalize, denormalize, range } from './math';

/**
 * Scale configuration for an axis
 */
export interface ScaleConfig {
  domain: [number, number];
  range: [number, number];
}

/**
 * Linear scale implementation
 */
export class LinearScale {
  private domain: [number, number];
  private range: [number, number];

  constructor(config: ScaleConfig) {
    this.domain = config.domain;
    this.range = config.range;
  }

  /**
   * Map a value from domain to range
   */
  scale(value: number): number {
    const normalized = normalize(value, this.domain[0], this.domain[1]);
    return denormalize(normalized, this.range[0], this.range[1]);
  }

  /**
   * Map a value from range back to domain
   */
  invert(value: number): number {
    const normalized = normalize(value, this.range[0], this.range[1]);
    return denormalize(normalized, this.domain[0], this.domain[1]);
  }

  /**
   * Update the domain
   */
  setDomain(domain: [number, number]): void {
    this.domain = domain;
  }

  /**
   * Update the range
   */
  setRange(range: [number, number]): void {
    this.range = range;
  }

  /**
   * Get current domain
   */
  getDomain(): [number, number] {
    return [...this.domain] as [number, number];
  }

  /**
   * Get current range
   */
  getRange(): [number, number] {
    return [...this.range] as [number, number];
  }

  /**
   * Auto-scale domain based on data
   */
  autoScale(data: number[], padding: number = 0.1): void {
    const { min, max } = range(data);
    const paddingAmount = (max - min) * padding;
    this.domain = [
      min - paddingAmount,
      max + paddingAmount,
    ];
  }
}

