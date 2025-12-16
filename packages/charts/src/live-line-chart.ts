import * as THREE from 'three';
import { RingBuffer } from '@dynamicgl/core';
import { LinearScale } from '@dynamicgl/core';
import { LiveDataPoint } from './types';

/**
 * Convert color (string or number) to Three.js color number
 */
function toColorNumber(color: number | string): number {
  if (typeof color === 'number') {
    return color;
  }
  // Remove # if present and parse hex
  const hex = color.replace('#', '');
  return parseInt(hex, 16);
}

/**
 * Configuration for LiveLineChart
 */
export interface LiveLineChartConfig {
  capacity: number;
  color?: number | string;
  lineWidth?: number;
  xDomain?: [number, number];
  yDomain?: [number, number];
}

/**
 * LiveLineChart - GPU-optimized line chart for streaming data
 * 
 * Uses a fixed-size ring buffer and reuses geometry to avoid per-frame allocations.
 * Only updates buffer attributes when data changes.
 */
export class LiveLineChart {
  private buffer: RingBuffer<LiveDataPoint>;
  private geometry: THREE.BufferGeometry;
  private material: THREE.LineBasicMaterial;
  private line: THREE.Line;
  private positionAttribute: THREE.BufferAttribute;
  private capacity: number;
  private xScale: LinearScale;
  private yScale: LinearScale;
  private color: number | string;
  private lineWidth: number;
  private needsUpdate: boolean;

  constructor(config: LiveLineChartConfig) {
    this.capacity = config.capacity;
    this.color = config.color ?? 0x00ffcc;
    this.lineWidth = config.lineWidth ?? 2;
    this.needsUpdate = false;

    // Initialize scales
    this.xScale = new LinearScale({
      domain: config.xDomain ?? [0, 1],
      range: [0, 1],
    });

    this.yScale = new LinearScale({
      domain: config.yDomain ?? [0, 1],
      range: [0, 1],
    });

    // Initialize ring buffer
    this.buffer = new RingBuffer<LiveDataPoint>(this.capacity);

    // Create geometry with fixed capacity
    const positions = new Float32Array(this.capacity * 3);
    this.positionAttribute = new THREE.BufferAttribute(positions, 3);
    this.positionAttribute.setUsage(THREE.DynamicDrawUsage);

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', this.positionAttribute);
    this.geometry.setDrawRange(0, 0); // Start with no points

    // Create material
    this.material = new THREE.LineBasicMaterial({
      color: toColorNumber(this.color),
      linewidth: this.lineWidth,
    });

    // Create line object
    this.line = new THREE.Line(this.geometry, this.material);
  }

  /**
   * Add a data point to the chart
   */
  addPoint(point: LiveDataPoint): void {
    this.buffer.push(point);
    this.needsUpdate = true;
  }

  /**
   * Add multiple data points
   */
  addPoints(points: LiveDataPoint[]): void {
    for (const point of points) {
      this.buffer.push(point);
    }
    this.needsUpdate = true;
  }

  /**
   * Update the geometry buffer attributes (call this before rendering)
   */
  update(): void {
    if (!this.needsUpdate) {
      return;
    }

    const size = this.buffer.getSize();
    if (size === 0) {
      this.geometry.setDrawRange(0, 0);
      this.needsUpdate = false;
      return;
    }

    const positions = this.positionAttribute.array as Float32Array;
    let index = 0;

    // Update positions from buffer
    for (let i = 0; i < size; i++) {
      const point = this.buffer.get(i);
      if (point) {
        const x = this.xScale.scale(point.x);
        const y = this.yScale.scale(point.y);
        positions[index++] = x;
        positions[index++] = y;
        positions[index++] = 0; // z = 0 for 2D
      }
    }

    // Mark attribute as needing update
    this.positionAttribute.needsUpdate = true;
    // Note: count is read-only and automatically computed from array length

    // Update draw range
    this.geometry.setDrawRange(0, size);

    // Mark geometry as needing update
    this.geometry.computeBoundingSphere();

    this.needsUpdate = false;
  }

  /**
   * Update X domain
   */
  setXDomain(domain: [number, number]): void {
    this.xScale.setDomain(domain);
    this.needsUpdate = true;
  }

  /**
   * Update Y domain
   */
  setYDomain(domain: [number, number]): void {
    this.yScale.setDomain(domain);
    this.needsUpdate = true;
  }

  /**
   * Update X range (screen space)
   */
  setXRange(range: [number, number]): void {
    this.xScale.setRange(range);
    this.needsUpdate = true;
  }

  /**
   * Update Y range (screen space)
   */
  setYRange(range: [number, number]): void {
    this.yScale.setRange(range);
    this.needsUpdate = true;
  }

  /**
   * Auto-scale Y domain based on current data
   */
  autoScaleY(padding: number = 0.1): void {
    const data = this.buffer.toArray();
    if (data.length === 0) return;

    const yValues = data.map((p) => p.y);
    this.yScale.autoScale(yValues, padding);
    this.needsUpdate = true;
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.buffer.clear();
    this.geometry.setDrawRange(0, 0);
    this.needsUpdate = false;
  }

  /**
   * Get the Three.js line object (add this to your scene)
   */
  getObject3D(): THREE.Line {
    return this.line;
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }

  /**
   * Get current data count
   */
  getDataCount(): number {
    return this.buffer.getSize();
  }

  /**
   * Get all current data points
   */
  getData(): LiveDataPoint[] {
    return this.buffer.toArray();
  }
}

