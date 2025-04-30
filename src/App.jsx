import React, { useRef, useEffect, useState, Suspense } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import {
  AccumulativeShadows,
  RandomizedLight,
  OrbitControls,
  Environment,
  useGLTF,
  useVideoTexture,
  useAnimations,
  Sparkles,
  Html,
  Billboard,
  Text,
  useEnvironment,
  Sky as SkyImpl,
} from "@react-three/drei";

import Model from "./Island.jsx";
import SmokeScreen from "./SmokeScreen.jsx";
import OrbitingModel from "./SwimmingFish.jsx";
import Clouds from "./Clouds.jsx";

function Loader3() {
  return (
    <Html>
      <div id="loading-dialog" class="hidden">
        <img src="tamagotchi1.jpeg" alt="Loading..." id="loading-image" />
      </div>
    </Html>
  );
}

export default function App() {
  let fishModel = "./fish.glb";
  return (
    <Canvas
      gl={{ antialias: true }}
      shadows
      camera={{ position: [0, -11.5, 15], fov: 35 }}
    >
      <ambientLight intensity={2.5} />
      <Clouds />
      <spotLight
        position={[-20, 0, 10]}
        color="red"
        angle={0.15}
        decay={0}
        penumbra={-1}
        intensity={30}
      />
      <spotLight
        position={[20, -10, 10]}
        color="red"
        angle={0.2}
        decay={0}
        penumbra={-1}
        intensity={20}
      />
      <SkyImpl
        distance={450000} // Camera distance
        sunPosition={[0, 1, 0]} // Sun position in the sky
        inclination={0} // Sun inclination
        azimuth={0.25} // Sun azimuth
        turbidity={0.5} // Turbidity of the atmosphere
        rayleigh={0.5} // Rayleigh scattering
      />
      <Suspense fallback={<Loader3 />}>
        <OrbitControls
          autoRotate={false}
          autoRotateSpeed={0.9}
          enableZoom={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.5}
          minAzimuthAngle={-Math.PI / 2}
          maxAzimuthAngle={Math.PI / 2}
        />
        <Environment preset="city" />

        {/* <directionalLight position={[0, 3, 5]} color="white" /> */}
        <Model />
        <SmokeScreen
          texturePath="./perlin.png"
          width={3}
          height={5.3}
          widthSegments={16}
          heightSegments={64}
          position={[31, 2, 10]} // Set the position (x, y, z)
          rotation={[0, 0, 0]} // Set the rotation (x, y, z in radians)
          scale={[0.5, 0.5, 1.0]} // Set the scale (x, y, z)
        />
        <SmokeScreen
          texturePath="./perlin.png"
          width={3}
          height={5.3}
          widthSegments={16}
          heightSegments={64}
          position={[31, 2, 10]} // Set the position (x, y, z)
          rotation={[0, Math.PI, 0]} // Set the rotation (x, y, z in radians)
          scale={[0.5, 0.5, 1.0]} // Set the scale (x, y, z)
        />
        <OrbitingModel
          url={fishModel}
          radius={0.5}
          period={12}
          color="#00ff00" // Green color
          center={{ x: 2, y: 1, z: -3 }}
          scale={0.1}
          bobDistance={0.1} // Bobbing distance
          bobPeriod={5}
        />
        {/* Smaller instance with non-uniform scaling */}
        <OrbitingModel
          url={fishModel}
          radius={0.4}
          period={22}
          color="#ff0000" // Red color
          center={{ x: -6.6, y: 0.17, z: 0 }}
          //scale={{ x: 0.5, y: 1, z: 0.5 }} // Non-uniform scaling
          scale={0.1}
          bobDistance={0.1} // Bobbing distance
          bobPeriod={5}
        />
      </Suspense>
    </Canvas>
  );
}
