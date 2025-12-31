import React, { useState, useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { LiveDataPoint } from '@dynamicgl/charts';
import { LinearScale } from '@dynamicgl/core';

/**
 * Configuration for value display
 */
export interface ValueDisplayConfig {
  /** Data points */
  data: LiveDataPoint[];
  /** X domain */
  xDomain: [number, number];
  /** Y domain */
  yDomain: [number, number];
  /** X range (screen space) */
  xRange: [number, number];
  /** Y range (screen space) */
  yRange: [number, number];
  /** Show latest point values */
  showLatest?: boolean;
  /** Show on hover */
  showOnHover?: boolean;
  /** X formatter */
  xFormatter?: (value: number) => string;
  /** Y formatter */
  yFormatter?: (value: number) => string;
  /** Display position */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Text color */
  textColor?: string;
  /** Background color */
  backgroundColor?: string;
}

/**
 * ValueDisplay - Shows x and y values from the chart
 * 
 * Can display latest point values or values at cursor position
 */
export function ValueDisplay({
  data,
  xDomain,
  yDomain,
  xRange,
  yRange,
  showLatest = true,
  showOnHover = false,
  xFormatter,
  yFormatter,
  position = 'top-right',
  textColor = '#000000',
  backgroundColor = 'rgba(255, 255, 255, 0.9)',
}: ValueDisplayConfig) {
  const { gl, camera } = useThree();
  const [latestPoint, setLatestPoint] = useState<LiveDataPoint | null>(null);
  const [hoverPoint, setHoverPoint] = useState<LiveDataPoint | null>(null);
  const [hoverWorldPos, setHoverWorldPos] = useState<THREE.Vector3 | null>(null);
  const xScale = useRef(new LinearScale({ domain: xDomain, range: xRange }));
  const yScale = useRef(new LinearScale({ domain: yDomain, range: yRange }));

  // Update scales
  useEffect(() => {
    xScale.current.setDomain(xDomain);
    xScale.current.setRange(xRange);
    yScale.current.setDomain(yDomain);
    yScale.current.setRange(yRange);
  }, [xDomain, yDomain, xRange, yRange]);

  // Update latest point
  useEffect(() => {
    if (data.length > 0) {
      setLatestPoint(data[data.length - 1]);
    } else {
      setLatestPoint(null);
    }
  }, [data]);

  // Handle mouse move for hover
  useEffect(() => {
    if (!showOnHover) {
      setHoverPoint(null);
      setHoverWorldPos(null);
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      const canvas = gl.domElement;
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;

      // Convert to normalized device coordinates
      const mouse = new THREE.Vector2(x * 2 - 1, y * 2 - 1);

      // Convert to data space
      const dataX = xScale.current.invert(mouse.x);
      const dataY = yScale.current.invert(mouse.y);

      // Find nearest point
      let nearest: LiveDataPoint | null = null;
      let minDist = Infinity;

      for (const point of data) {
        const distX = Math.abs(point.x - dataX) / (xDomain[1] - xDomain[0]);
        const distY = Math.abs(point.y - dataY) / (yDomain[1] - yDomain[0]);
        const dist = Math.sqrt(distX * distX + distY * distY);

        if (dist < minDist && dist < 0.1) {
          minDist = dist;
          nearest = point;
        }
      }

      if (nearest) {
        setHoverPoint(nearest);
        const worldX = xScale.current.scale(nearest.x);
        const worldY = yScale.current.scale(nearest.y);
        setHoverWorldPos(new THREE.Vector3(worldX, worldY, 0));
      } else {
        setHoverPoint(null);
        setHoverWorldPos(null);
      }
    };

    const canvas = gl.domElement;
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', () => {
      setHoverPoint(null);
      setHoverWorldPos(null);
    });

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', () => {
        setHoverPoint(null);
        setHoverWorldPos(null);
      });
    };
  }, [showOnHover, gl, data, xDomain, yDomain, xRange, yRange]);

  const formatX = xFormatter ?? ((v: number) => {
    if (v > 1000000000000) {
      return new Date(v).toLocaleTimeString();
    }
    return v.toFixed(2);
  });

  const formatY = yFormatter ?? ((v: number) => v.toFixed(2));

  const displayPoint = hoverPoint ?? (showLatest ? latestPoint : null);
  if (!displayPoint) return null;

  // Calculate position in world space
  let worldPosition: THREE.Vector3;
  if (hoverWorldPos) {
    worldPosition = hoverWorldPos;
  } else if (latestPoint) {
    const worldX = xScale.current.scale(latestPoint.x);
    const worldY = yScale.current.scale(latestPoint.y);
    worldPosition = new THREE.Vector3(worldX, worldY, 0);
  } else {
    return null;
  }

  // Position offset based on position prop
  const offsets: Record<string, [number, number]> = {
    'top-left': [-0.2, 0.2],
    'top-right': [0.2, 0.2],
    'bottom-left': [-0.2, -0.2],
    'bottom-right': [0.2, -0.2],
  };

  const [offsetX, offsetY] = offsets[position] || [0.2, 0.2];
  const displayPos = new THREE.Vector3(
    worldPosition.x + offsetX,
    worldPosition.y + offsetY,
    0.1
  );

  return (
    <Html
      position={displayPos}
      center
      style={{ pointerEvents: 'none' }}
      transform
      occlude
    >
      <div
        style={{
          background: backgroundColor,
          color: textColor,
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontFamily: 'monospace',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          lineHeight: '1.3',
        }}
      >
        <div style={{ fontSize: '10px', marginBottom: '2px', opacity: 0.7 }}>X: {formatX(displayPoint.x)}</div>
        <div style={{ fontSize: '10px' }}>Y: {formatY(displayPoint.y)}</div>
      </div>
    </Html>
  );
}

