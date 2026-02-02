import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';

// This is the actual Heart Mesh
const PulsingHeart = ({ bpm, status }) => {
  const meshRef = useRef();
  
  // Color Logic: Red for Critical, Cyan for Normal
  const color = status === 'critical' ? '#ef4444' : '#22d3ee';
  const speed = bpm > 0 ? bpm / 60 : 0; // Convert BPM to Speed

  useFrame((state) => {
    // Math to make it "beat"
    const time = state.clock.getElapsedTime();
    // Beat frequency increases with BPM
    const beat = Math.sin(time * speed * 5) * 0.2; 
    
    // Apply Scale (Pumping effect)
    meshRef.current.scale.set(1 + beat, 1 + beat, 1 + beat);
  });

  return (
    <Sphere args={[1, 32, 32]} ref={meshRef} scale={1.5}>
      {/* DistortMaterial makes it look like a fluid/organic organ.
         Wireframe = true gives it that "Sci-Fi/Hologram" look 
      */}
      <MeshDistortMaterial 
        color={color} 
        wireframe={true} 
        distort={0.4} 
        speed={2} 
        roughness={0}
      />
    </Sphere>
  );
};

const Heart3D = ({ bpm, status }) => {
  return (
    <div className="h-full w-full min-h-[200px] flex items-center justify-center bg-gray-900/20 rounded-xl overflow-hidden relative">
      <div className="absolute top-2 left-2 z-10">
        <span className="text-[10px] bg-black/50 text-gray-400 px-2 py-1 rounded border border-gray-700">
          DIGITAL TWIN V1.0
        </span>
      </div>
      
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <PulsingHeart bpm={bpm} status={status} />
        <OrbitControls enableZoom={false} autoRotate={true} autoRotateSpeed={2} />
      </Canvas>
    </div>
  );
};

export default Heart3D;