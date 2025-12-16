import * as THREE from 'three';
import { LinearScale } from './scaling';
import { generateTicks } from './axes';

/**
 * Grid configuration
 */
export interface GridConfig {
  xScale: LinearScale;
  yScale: LinearScale;
  width: number;
  height: number;
  color?: number;
  lineWidth?: number;
  xTickCount?: number;
  yTickCount?: number;
}

/**
 * Create a 2D grid in Three.js
 */
export function createGrid(config: GridConfig): THREE.Group {
  const group = new THREE.Group();
  const color = config.color ?? 0x333333;
  const lineWidth = config.lineWidth ?? 1;
  const material = new THREE.LineBasicMaterial({ color, linewidth: lineWidth });

  // Vertical lines (x-axis ticks)
  const xTicks = generateTicks(config.xScale, config.xTickCount ?? 5);
  for (const tick of xTicks) {
    const x = config.xScale.scale(tick);
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x, 0, 0),
      new THREE.Vector3(x, config.height, 0),
    ]);
    group.add(new THREE.Line(geometry, material));
  }

  // Horizontal lines (y-axis ticks)
  const yTicks = generateTicks(config.yScale, config.yTickCount ?? 5);
  for (const tick of yTicks) {
    const y = config.yScale.scale(tick);
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, y, 0),
      new THREE.Vector3(config.width, y, 0),
    ]);
    group.add(new THREE.Line(geometry, material));
  }

  return group;
}

