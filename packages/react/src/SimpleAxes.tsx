import React from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Simple Axes component props
 */
export interface SimpleAxesProps {
  axisColor?: number | string;
  gridColor?: number | string;
  axisWidth?: number;
  gridWidth?: number;
}

/**
 * Simple Axes component - just shows X and Y axes with grid
 * This is a simpler version that doesn't use the core axes utilities
 */
export function SimpleAxes({
  axisColor = 0xffffff,
  gridColor = 0x888888,
  axisWidth = 2,
  gridWidth = 1,
}: SimpleAxesProps = {}) {
  const { viewport } = useThree();
  const groupRef = React.useRef<THREE.Group>(null);

  // Convert color to number if string
  const axisColorNum = typeof axisColor === 'string' 
    ? parseInt(axisColor.replace('#', ''), 16) 
    : axisColor;
  const gridColorNum = typeof gridColor === 'string'
    ? parseInt(gridColor.replace('#', ''), 16)
    : gridColor;

  React.useEffect(() => {
    if (!groupRef.current) return;

    const group = groupRef.current;
    
    // Use viewport if available, otherwise use default aspect (800/400 = 2)
    let aspect = 2;
    if (viewport.width > 0 && viewport.height > 0) {
      aspect = viewport.width / viewport.height;
    }

    // Clear existing children
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    // Create X axis (horizontal line at y=0)
    const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-aspect, 0, 0),
      new THREE.Vector3(aspect, 0, 0),
    ]);
    const xAxisMaterial = new THREE.LineBasicMaterial({ color: axisColorNum, linewidth: axisWidth });
    const xAxis = new THREE.Line(xAxisGeometry, xAxisMaterial);
    group.add(xAxis);

    // Create Y axis (vertical line at x=0)
    const yAxisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(0, 1, 0),
    ]);
    const yAxisMaterial = new THREE.LineBasicMaterial({ color: axisColorNum, linewidth: axisWidth });
    const yAxis = new THREE.Line(yAxisGeometry, yAxisMaterial);
    group.add(yAxis);

    // Create grid lines
    const gridMaterial = new THREE.LineBasicMaterial({ color: gridColorNum, linewidth: gridWidth });

    // Vertical grid lines
    for (let i = -aspect; i <= aspect; i += aspect / 4) {
      if (Math.abs(i) < 0.01) continue; // Skip center (Y axis)
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i, -1, 0),
        new THREE.Vector3(i, 1, 0),
      ]);
      const line = new THREE.Line(geometry, gridMaterial);
      group.add(line);
    }

    // Horizontal grid lines
    for (let i = -1; i <= 1; i += 0.25) {
      if (Math.abs(i) < 0.01) continue; // Skip center (X axis)
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-aspect, i, 0),
        new THREE.Vector3(aspect, i, 0),
      ]);
      const line = new THREE.Line(geometry, gridMaterial);
      group.add(line);
    }
  }, [viewport.width, viewport.height, axisColorNum, gridColorNum, axisWidth, gridWidth]);

  return <group ref={groupRef} />;
}

