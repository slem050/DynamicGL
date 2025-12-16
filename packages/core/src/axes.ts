import * as THREE from 'three';
import { LinearScale } from './scaling';

/**
 * Axis configuration
 */
export interface AxisConfig {
  scale: LinearScale;
  position: 'bottom' | 'top' | 'left' | 'right';
  length: number;
  color?: number;
  lineWidth?: number;
  tickCount?: number;
  tickLength?: number;
  labelFormatter?: (value: number) => string;
}

/**
 * Create a 2D axis line in Three.js
 */
export function createAxisLine(config: AxisConfig): THREE.Line {
  const color = config.color ?? 0x666666;
  const lineWidth = config.lineWidth ?? 1;

  let start: THREE.Vector3;
  let end: THREE.Vector3;

  switch (config.position) {
    case 'bottom':
      start = new THREE.Vector3(0, 0, 0);
      end = new THREE.Vector3(config.length, 0, 0);
      break;
    case 'top':
      start = new THREE.Vector3(0, 0, 0);
      end = new THREE.Vector3(config.length, 0, 0);
      break;
    case 'left':
      start = new THREE.Vector3(0, 0, 0);
      end = new THREE.Vector3(0, config.length, 0);
      break;
    case 'right':
      start = new THREE.Vector3(0, 0, 0);
      end = new THREE.Vector3(0, config.length, 0);
      break;
  }

  const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
  const material = new THREE.LineBasicMaterial({ color, linewidth: lineWidth });
  return new THREE.Line(geometry, material);
}

/**
 * Generate tick positions for an axis
 */
export function generateTicks(
  scale: LinearScale,
  count: number = 5
): number[] {
  const domain = scale.getDomain();
  const step = (domain[1] - domain[0]) / (count - 1);
  const ticks: number[] = [];

  for (let i = 0; i < count; i++) {
    ticks.push(domain[0] + step * i);
  }

  return ticks;
}

