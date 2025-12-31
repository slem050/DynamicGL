import React from 'react';
import { useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export interface AxisLabelsProps {
  xDomain?: [number, number];
  yDomain?: [number, number];
  xTickCount?: number;
  yTickCount?: number;
  labelColor?: string;
  labelFormatter?: {
    x?: (value: number) => string;
    y?: (value: number) => string;
  };
}

/**
 * AxisLabels - Three.js text labels for axis values
 */
export function AxisLabels({
  xDomain = [-2, 2],
  yDomain = [-1, 1],
  xTickCount = 5,
  yTickCount = 5,
  labelColor = '#666666',
  labelFormatter,
}: AxisLabelsProps) {
  const { camera } = useThree();

  // Calculate aspect ratio
  let aspect = 2;
  if (camera instanceof THREE.OrthographicCamera) {
    aspect = (camera.right - camera.left) / (camera.top - camera.bottom);
  }

  // Generate tick values
  const xTicks: number[] = [];
  const xStep = (xDomain[1] - xDomain[0]) / (xTickCount - 1);
  for (let i = 0; i < xTickCount; i++) {
    xTicks.push(xDomain[0] + xStep * i);
  }

  const yTicks: number[] = [];
  const yStep = (yDomain[1] - yDomain[0]) / (yTickCount - 1);
  for (let i = 0; i < yTickCount; i++) {
    yTicks.push(yDomain[0] + yStep * i);
  }

  // Format functions
  const formatX = labelFormatter?.x ?? ((v: number) => v.toFixed(1));
  const formatY = labelFormatter?.y ?? ((v: number) => v.toFixed(1));

  // Convert color
  const colorNum = typeof labelColor === 'string' 
    ? parseInt(labelColor.replace('#', ''), 16) 
    : labelColor;

  return (
    <group>
      {/* X axis labels */}
      {xTicks.map((value, i) => {
        const worldX = ((value - xDomain[0]) / (xDomain[1] - xDomain[0])) * (aspect * 2) - aspect;
        return (
          <Text
            key={`x-${i}`}
            position={[worldX, -1.1, 0]}
            fontSize={0.08}
            color={colorNum}
            anchorX="center"
            anchorY="top"
          >
            {formatX(value)}
          </Text>
        );
      })}

      {/* Y axis labels */}
      {yTicks.map((value, i) => {
        const worldY = ((value - yDomain[0]) / (yDomain[1] - yDomain[0])) * 2 - 1;
        return (
          <Text
            key={`y-${i}`}
            position={[-aspect - 0.1, worldY, 0]}
            fontSize={0.08}
            color={colorNum}
            anchorX="right"
            anchorY="middle"
          >
            {formatY(value)}
          </Text>
        );
      })}
    </group>
  );
}

