import React, { useRef, useEffect, useState, Suspense } from "react";
import * as THREE from "three";
import { AxesHelper } from "three";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Sparkles,
  Html,
  Billboard,
  Text,
  useEnvironment,
  Sky as SkyImpl,
  Image,
} from "@react-three/drei";

import Model from "./Island.jsx";
import SmokeScreen from "./SmokeScreen.jsx";
import OrbitingModel from "./OrbitingModel.jsx";
import Clouds from "./Clouds.jsx";
import Seabed from "./Seabed.jsx";

function Loader3() {
  return (
    <Html>
      <div id="loading-dialog" class="hidden">
        <img src="volcano4.jpeg" alt="Loading..." id="loading-image" />
      </div>
    </Html>
  );
}

export default function App() {
  let fishModel = "./fish.glb";
  let blimpModel = "./blimp2.glb";
  return (
    <Canvas
      gl={{ antialias: true }}
      shadows
      camera={{ position: [0, -10.5, 14], fov: 35 }}
    >
      <Environment
        preset="dawn"
        background
        backgroundBlurriness={0.9}
        backgroundIntensity={0.002}
      />
      <ambientLight intensity={2.0} />
      <directionalLight position={[0, 40, 40]} intensity={2} color="white" />

      <spotLight
        position={[-20, 0, 10]}
        color="white"
        angle={0.15}
        decay={0}
        penumbra={-1}
        intensity={15}
      />
      <spotLight
        position={[20, 10, 10]}
        color="red"
        angle={0.2}
        decay={0}
        penumbra={-1}
        intensity={15}
      />

      <Suspense fallback={<Loader3 />}>
        <Clouds />

        <Seabed />
        <OrbitControls
          autoRotate={false}
          autoRotateSpeed={0.9}
          enableZoom={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.5}
          minAzimuthAngle={-Math.PI}
          maxAzimuthAngle={Math.PI}
        />

        <Model />

        <Image
          url="/treasure_chest02.jpeg"
          position={[3.36, 0.117, -6.7]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[0.75, 0.75, 1]}
          side={THREE.DoubleSide}
        />
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
          period={9}
          color="#ffffff" // Green color
          center={{ x: 6.0, y: 0.24, z: -2.96 }}
          scale={0.085}
          bobDistance={0.1} // Bobbing distance
          bobPeriod={8}
          rotationDirection={-1}
        />
        <OrbitingModel
          url={fishModel}
          radius={0.5}
          period={9}
          color="#fff000"
          center={{ x: 7.0, y: 0.24, z: 2.0 }}
          scale={0.085}
          bobDistance={0.1} // Bobbing distance
          bobPeriod={8}
          rotationDirection={-1}
        />
        <OrbitingModel
          url={fishModel}
          radius={0.5}
          period={9}
          color="#bb33ff"
          center={{ x: 4.3, y: 0.18, z: 5.0 }}
          scale={0.045}
          bobDistance={0.1} // Bobbing distance
          bobPeriod={8}
        />
        <OrbitingModel
          url={fishModel}
          radius={1.0}
          period={10}
          color="#000000"
          center={{ x: 6.0, y: 0.24, z: -1.96 }}
          scale={0.085}
          bobDistance={0.1} // Bobbing distance
          bobPeriod={5}
        />
        <OrbitingModel
          url={fishModel}
          radius={0.5}
          period={19}
          color="#00ff00" // Green color
          center={{ x: 6.0, y: 0.26, z: -2.5 }}
          scale={0.085}
          bobDistance={0.1} // Bobbing distance
          bobPeriod={5}
        />

        <OrbitingModel
          url={fishModel}
          radius={0.4}
          period={22}
          color="#ff0000"
          center={{ x: -6.6, y: 0.17, z: 0 }}
          scale={0.085}
          bobDistance={0.1} // Bobbing distance
          bobPeriod={5}
          rotationDirection={-1}
        />
        <OrbitingModel
          url={fishModel}
          radius={0.4}
          period={8}
          color="#ff7e33"
          center={{ x: 0, y: 0.17, z: -7.0 }}
          scale={0.085}
          bobDistance={0.1} // Bobbing distance
          bobPeriod={5}
          rotationDirection={-1}
        />
        <OrbitingModel
          url={fishModel}
          radius={0.8}
          period={18}
          color="#3437eb"
          center={{ x: -5, y: 0.17, z: 4.0 }}
          scale={0.065}
          bobDistance={0.1} // Bobbing distance
          bobPeriod={5}
          rotationDirection={-1}
        />
        <OrbitingModel
          url={blimpModel}
          radius={5.8}
          period={70.8}
          color="#3437eb"
          center={{ x: 0, y: 3.17, z: 0.0 }}
          scale={1.05}
          bobDistance={0.0} // Bobbing distance
          bobPeriod={5}
          rotationDirection={-1}
        />
      </Suspense>
    </Canvas>
  );
}
