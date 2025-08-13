import { Canvas, useThree } from '@react-three/fiber';
import Scene from './Scene';
import { useEffect } from 'react';

/**
 * A component responsible for managing WebGL context events.
 * As per the spec, it listens for context loss and restoration.
 */
function WebGLContextManager() {
  const { gl, invalidate } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn('WebGL context lost. Pausing render loop.');
      invalidate(); // Pauses the render loop if frameloop is 'demand'
    };

    const handleContextRestored = () => {
      console.log('WebGL context restored. Resuming render loop.');
      // The render loop should resume automatically if needed,
      // especially if state changes trigger a new frame.
    };

    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [gl, invalidate]);

  return null;
}


/**
 * The main 3D canvas wrapper for the application.
 * It contains the R3F Canvas with all the specified settings.
 */
function Canvas3D() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
      <Canvas
        shadows
        dpr={[1, Math.min(2, window.devicePixelRatio)]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 80, 100], fov: 50 }}
        frameloop="always"
      >
        <WebGLContextManager />
        <Scene />
      </Canvas>
    </div>
  );
}

export default Canvas3D;
