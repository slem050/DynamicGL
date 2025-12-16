import React, { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export interface BasicAxesProps {
  axisColor?: number | string;
  gridColor?: number | string;
}

export function BasicAxes({ axisColor = 0x000000, gridColor = 0xcccccc }: BasicAxesProps = {}) {
  const { viewport, camera } = useThree();

  // Convert colors
  const axisColorNum = typeof axisColor === 'string' 
    ? parseInt(axisColor.replace('#', ''), 16) 
    : axisColor;
  const gridColorNum = typeof gridColor === 'string'
    ? parseInt(gridColor.replace('#', ''), 16)
    : gridColor;

  // Calculate aspect ratio from camera if orthographic, otherwise use viewport
  let aspect = 2; // Default
  if (camera instanceof THREE.OrthographicCamera) {
    // For orthographic camera, calculate from camera bounds
    aspect = (camera.right - camera.left) / (camera.top - camera.bottom);
  } else if (viewport.width > 0 && viewport.height > 0) {
    aspect = viewport.width / viewport.height;
  }

  // Create axes and grid using useMemo
  const { xAxis, yAxis, gridLines } = useMemo(() => {
    // X axis (horizontal) - make it thicker and more visible
    const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-aspect, 0, 0),
      new THREE.Vector3(aspect, 0, 0),
    ]);
    const xAxisMaterial = new THREE.LineBasicMaterial({ color: axisColorNum, linewidth: 3 });
    const xAxis = new THREE.Line(xAxisGeometry, xAxisMaterial);

    // Y axis (vertical) - make it thicker and more visible
    const yAxisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(0, 1, 0),
    ]);
    const yAxisMaterial = new THREE.LineBasicMaterial({ color: axisColorNum, linewidth: 3 });
    const yAxis = new THREE.Line(yAxisGeometry, yAxisMaterial);

    // Grid lines (fewer lines for clarity)
    const gridMaterial = new THREE.LineBasicMaterial({ color: gridColorNum, linewidth: 1 });
    const gridLines: THREE.Line[] = [];

    // Vertical grid lines (only 2 on each side of center)
    for (let i = -aspect; i <= aspect; i += aspect / 2) {
      if (Math.abs(i) > 0.01) { // Skip center (Y axis)
        const geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(i, -1, 0),
          new THREE.Vector3(i, 1, 0),
        ]);
        gridLines.push(new THREE.Line(geometry, gridMaterial));
      }
    }

    // Horizontal grid lines (only 2 above and below center)
    for (let i = -1; i <= 1; i += 0.5) {
      if (Math.abs(i) > 0.01) { // Skip center (X axis)
        const geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-aspect, i, 0),
          new THREE.Vector3(aspect, i, 0),
        ]);
        gridLines.push(new THREE.Line(geometry, gridMaterial));
      }
    }

    return { xAxis, yAxis, gridLines };
  }, [aspect, axisColorNum, gridColorNum]);

  return (
    <group>
      <primitive object={xAxis} />
      <primitive object={yAxis} />
      {gridLines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
    </group>
  );
}

