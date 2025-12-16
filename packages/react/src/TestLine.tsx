import React from 'react';
import * as THREE from 'three';

/**
 * Simple test component - just renders a single line to verify Three.js works
 */
export function TestLine() {
  const lineRef = React.useRef<THREE.Line | null>(null);

  React.useEffect(() => {
    // Create a simple line from (-1, 0) to (1, 0)
    const points = [
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(1, 0, 0),
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 3 });
    const line = new THREE.Line(geometry, material);
    lineRef.current = line;
  }, []);

  if (!lineRef.current) return null;
  return <primitive object={lineRef.current} />;
}

