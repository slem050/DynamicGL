import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ChartCanvasProps } from './types';

/**
 * ChartCanvas - Container component that owns the Three.js renderer
 * 
 * This component:
 * - Creates and manages the canvas
 * - Handles resize events
 * - Provides a shared coordinate space for charts
 * - Manages the render loop
 */
export function ChartCanvas({
  width,
  height,
  backgroundColor = '#1a1a1a',
  children,
  onResize,
}: ChartCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: width ?? 800, height: height ?? 600 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      const newWidth = rect.width;
      const newHeight = height ? height : rect.height;
      setDimensions({ width: newWidth, height: newHeight });
      onResize?.(newWidth, newHeight);
    };

    // Initial size
    updateDimensions();

    // Watch for resize
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [height, onResize]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: height ? `${height}px` : '100%',
        position: 'relative',
      }}
    >
      <Canvas
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
        orthographic
        camera={{
          zoom: 1,
          position: [0, 0, 5],
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: false,
        }}
        onCreated={({ scene, gl }) => {
          // Set scene background color explicitly
          const bgColor = typeof backgroundColor === 'string' 
            ? backgroundColor 
            : `#${backgroundColor.toString(16).padStart(6, '0')}`;
          scene.background = new THREE.Color(bgColor);
        }}
      >
        <CameraController width={dimensions.width} height={dimensions.height} />
        {children}
      </Canvas>
    </div>
  );
}

/**
 * Camera controller component to set up orthographic camera
 */
function CameraController({ width, height }: { width: number; height: number }) {
  const { camera, gl, size } = useThree();

  useEffect(() => {
    if (camera instanceof THREE.OrthographicCamera && width > 0 && height > 0) {
      const aspect = width / height;
      camera.left = -aspect;
      camera.right = aspect;
      camera.top = 1;
      camera.bottom = -1;
      camera.zoom = 1;
      camera.updateProjectionMatrix();
      
      // Update renderer size to match container
      gl.setSize(width, height, false);
    }
  }, [camera, width, height, gl]);

  return null;
}

