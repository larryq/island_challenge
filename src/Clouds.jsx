import * as THREE from "three";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Clouds,
  Cloud,
  CameraControls,
  Sky as SkyImpl,
  StatsGl,
} from "@react-three/drei";
// import { useControls } from "leva";

export default function AtmosphericClouds() {
  const ref = useRef();
  const cloud0 = useRef();
  const cloud1 = useRef();

  useFrame((state, delta) => {
    // ref.current.rotation.y = Math.cos(state.clock.elapsedTime / 2) / 2;
    // ref.current.rotation.x = Math.sin(state.clock.elapsedTime / 2) / 2;
    cloud0.current.rotation.y -= delta;
  });
  return (
    <>
      {/* <SkyImpl /> */}
      <group ref={ref}>
        <Clouds material={THREE.MeshLambertMaterial} limit={400} range={344}>
          <Cloud
            ref={cloud0}
            segments={20}
            volume={3}
            opacity={0.23}
            fade={10}
            growth={2}
            speed={0.7}
            bounds={[0.3, 0.1, 0.5]}
            color="#eed0d0"
            seed={5}
            position={[-4.5, 2.0, -1.9]}
          />
          <Cloud
            ref={cloud0}
            segments={20}
            volume={2.5}
            opacity={0.1}
            fade={10}
            growth={2}
            speed={0.7}
            bounds={[0.05, 0.1, 0.05]}
            color="#a83248"
            seed={5}
            position={[-4.5, 1.0, -1.9]}
          />
          <Cloud
            ref={cloud1}
            segments={20}
            volume={0.015}
            opacity={0.11}
            fade={8}
            growth={2.2}
            speed={0.6}
            bounds={[0.075, 0.1, 0.075]}
            color="#ff5833"
            seed={5}
            //position={[0, 0, 0]}
            position={[2.5, 1.18, 0.3]}
          />
          {/* <Cloud
            {...config}
            bounds={[x, y, z]}
            color="#d0e0d0"
            seed={3}
            position={[-0, 0, 0]}
          />
          <Cloud
            {...config}
            bounds={[x, y, z]}
            color="#a0b0d0"
            seed={4}
            position={[0, 0, -12]}
          />
          <Cloud
            {...config}
            bounds={[x, y, z]}
            color="#c0c0dd"
            seed={5}
            position={[0, 0, 12]}
          />
          <Cloud
            concentrate="outside"
            growth={50}
            color="#ffccdd"
            opacity={1.25}
            seed={0.3}
            bounds={200}
            volume={200}
          /> */}
        </Clouds>
      </group>
    </>
  );
}
