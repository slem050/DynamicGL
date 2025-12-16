import { LinearScale } from './scaling';

/**
 * Coordinate system configuration
 */
export interface CoordinateSystemConfig {
  width: number;
  height: number;
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

/**
 * Coordinate system for mapping data to screen space
 */
export class CoordinateSystem {
  private xScale: LinearScale;
  private yScale: LinearScale;
  private width: number;
  private height: number;
  private padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };

  constructor(config: CoordinateSystemConfig) {
    this.width = config.width;
    this.height = config.height;
    this.padding = {
      top: config.padding?.top ?? 0,
      right: config.padding?.right ?? 0,
      bottom: config.padding?.bottom ?? 0,
      left: config.padding?.left ?? 0,
    };

    const plotWidth = this.width - this.padding.left - this.padding.right;
    const plotHeight = this.height - this.padding.top - this.padding.bottom;

    this.xScale = new LinearScale({
      domain: [0, 1],
      range: [this.padding.left, this.padding.left + plotWidth],
    });

    this.yScale = new LinearScale({
      domain: [0, 1],
      range: [this.padding.bottom + plotHeight, this.padding.bottom],
    });
  }

  /**
   * Transform x from data space to screen space
   */
  transformX(x: number): number {
    return this.xScale.scale(x);
  }

  /**
   * Transform y from data space to screen space
   */
  transformY(y: number): number {
    return this.yScale.scale(y);
  }

  /**
   * Transform a point from data space to screen space
   */
  transform(x: number, y: number): [number, number] {
    return [this.transformX(x), this.transformY(y)];
  }

  /**
   * Invert x from screen space to data space
   */
  invertX(x: number): number {
    return this.xScale.invert(x);
  }

  /**
   * Invert y from screen space to data space
   */
  invertY(y: number): number {
    return this.yScale.invert(y);
  }

  /**
   * Update the X domain
   */
  setXDomain(domain: [number, number]): void {
    this.xScale.setDomain(domain);
  }

  /**
   * Update the Y domain
   */
  setYDomain(domain: [number, number]): void {
    this.yScale.setDomain(domain);
  }

  /**
   * Update dimensions
   */
  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;

    const plotWidth = this.width - this.padding.left - this.padding.right;
    const plotHeight = this.height - this.padding.top - this.padding.bottom;

    this.xScale.setRange([this.padding.left, this.padding.left + plotWidth]);
    this.yScale.setRange([this.padding.bottom + plotHeight, this.padding.bottom]);
  }

  /**
   * Get the plot area dimensions
   */
  getPlotArea(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.padding.left,
      y: this.padding.bottom,
      width: this.width - this.padding.left - this.padding.right,
      height: this.height - this.padding.top - this.padding.bottom,
    };
  }
}

