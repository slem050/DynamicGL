'use client';

import React, { useRef, useEffect } from 'react';
import { ChartCanvas } from '@dynamicgl/react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simple test to verify Three.js rendering works
export function DebugChart() {
  return (
    <ChartCanvas width={800} height={400}>
      <TestLine />
    </ChartCanvas>
  );
}

function TestLine() {
  const lineRef = useRef<THREE.Line | null>(null);

  useEffect(() => {
    if (!lineRef.current) {
      const points = [
        new THREE.Vector3(-1, -0.5, 0),
        new THREE.Vector3(0, 0.5, 0),
        new THREE.Vector3(1, -0.5, 0),
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0x00ffcc, linewidth: 3 });
      const line = new THREE.Line(geometry, material);
      lineRef.current = line;
    }
  }, []);

  if (!lineRef.current) return null;
  return <primitive object={lineRef.current} />;
}

