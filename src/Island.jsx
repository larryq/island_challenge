import {
  OrbitControls,
  useGLTF,
  shaderMaterial,
  Sparkles,
  Image,
} from "@react-three/drei";
import { extend, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { TextureLoader } from "three";
import { useRef } from "react";
import surfaceVertexShader from "./shaders/vertex.glsl";
import surfaceFragmentShader from "./shaders/fragment.glsl";
import waveVertexShader from "./shaders/waveVertex.glsl";
import waveFragmentShader from "./shaders/waveFragment.glsl";
import smokeVertexShader from "./shaders/smoke/vertex2.glsl";
import smokeFragmentShader from "./shaders/smoke/fragment2.glsl";

//import GUI from "lil-gui";

//const gui = new GUI({ width: 340 });

VolcanoSetup();
WaveSetup();
BoilingWaterSetup();
LavaPlaneSetup();
WaterCircleSetup();

export function WaveSetup() {
  const WaveMaterial = shaderMaterial(
    {
      time: 0.0,
      lightPosition: new THREE.Vector3(10, 10, 10),
      lightColor: new THREE.Vector3(1, 1, 1),
    },
    waveVertexShader,
    waveFragmentShader
  );

  extend({ WaveMaterial });
}

function VolcanoSetup() {
  const Volcano1Material = shaderMaterial(
    {
      uTime: 0,
      //uSurfaceColor: new THREE.Color("#FFFFFF"),
      uSurfaceColor: new THREE.Color("#151c37"),
      //uDepthColor: new THREE.Color("#FFFFFF"),
      uDepthColor: new THREE.Color("#ff4000"),
      uBigWavesElevation: 0.12,
      uBigWavesFrequency: new THREE.Vector2(4, 4),
      uBigWavesSpeed: 0.15,

      uSmallWavesElevation: 0.25,
      uSmallWavesFrequency: 3.0,
      uSmallWavesSpeed: 0.15,
      uSmallIterations: 4.0,

      uColorOffset: 0.925,
      uColorMultiplier: 1,
    },
    surfaceVertexShader,
    surfaceFragmentShader
  );

  extend({ Volcano1Material });
}

function WaterCircleSetup() {
  const WaterCircleMaterial = shaderMaterial(
    {
      uTime: 0,
      //uSurfaceColor: new THREE.Color("#FFFFFF"),
      uSurfaceColor: new THREE.Color("#2030AD"),
      //uDepthColor: new THREE.Color("#FFFFFF"),
      uDepthColor: new THREE.Color("#ffffff"),
      uBigWavesElevation: 0.12,
      uBigWavesFrequency: new THREE.Vector2(4, 4),
      uBigWavesSpeed: 0.15,

      uSmallWavesElevation: 0.25,
      uSmallWavesFrequency: 3.0,
      uSmallWavesSpeed: 0.15,
      uSmallIterations: 4.0,

      uColorOffset: 0.925,
      uColorMultiplier: 1,
    },
    surfaceVertexShader,
    surfaceFragmentShader
  );

  extend({ WaterCircleMaterial });
}

function LavaPlaneSetup() {
  const LavaPlaneMaterial = shaderMaterial(
    {
      uTime: 0,
      //uSurfaceColor: new THREE.Color("#FFFFFF"),
      uSurfaceColor: new THREE.Color("#151c37"),
      //uDepthColor: new THREE.Color("#FFFFFF"),
      uDepthColor: new THREE.Color("#ff4000"),
      uBigWavesElevation: 0.12,
      uBigWavesFrequency: new THREE.Vector2(4, 4),
      uBigWavesSpeed: 0.15,

      uSmallWavesElevation: 0.25,
      uSmallWavesFrequency: 3.0,
      uSmallWavesSpeed: 0.15,
      uSmallIterations: 4.0,

      uColorOffset: 0.925,
      uColorMultiplier: 1,
    },
    surfaceVertexShader,
    surfaceFragmentShader
  );

  extend({ LavaPlaneMaterial });
}

function BoilingWaterSetup() {
  const BoilingWaterMaterial = shaderMaterial(
    {
      uTime: 0,
      uSurfaceColor: new THREE.Color("#F93827"),
      uDepthColor: new THREE.Color("#2030AD"),
      uBigWavesElevation: 0.12,
      uBigWavesFrequency: new THREE.Vector2(4, 4),
      uBigWavesSpeed: 0.15,

      uSmallWavesElevation: 0.25,
      uSmallWavesFrequency: 3.0,
      uSmallWavesSpeed: 0.15,
      uSmallIterations: 4.0,

      uColorOffset: 0.925,
      uColorMultiplier: 1,
    },
    surfaceVertexShader,
    surfaceFragmentShader
  );

  extend({ BoilingWaterMaterial });
}

export default function Model(props) {
  const { nodes, materials } = useGLTF("/island2.glb");
  const surfaceMaterial = useRef();
  const waveMaterial = useRef();
  const smokeMaterial = useRef();
  const smokeMaterial2 = useRef();
  const waterCircleMaterial = useRef();
  const lavaPlaneMaterial = useRef();
  const boilingWaterMaterial = useRef();

  const smokeTexture = useLoader(TextureLoader, "./perlin.png");
  smokeTexture.wrapS = smokeTexture.wrapT = THREE.RepeatWrapping; // Set texture wrapping mode

  const SmokeMaterial = shaderMaterial(
    {
      uTime: 0.0,
      uPerlinTexture: { value: smokeTexture },
    },
    smokeVertexShader,
    smokeFragmentShader
  );

  extend({ SmokeMaterial });

  useFrame((state, delta) => {
    surfaceMaterial.current.uTime += delta * 2;

    waveMaterial.current.time += delta * 2;

    boilingWaterMaterial.current.uTime += delta * 3;

    waterCircleMaterial.current.uTime += delta * 0.8;
  });
  return (
    <group {...props} dispose={null}>
      <group position={[0.173, -1, 0.013]} scale={[10, 1, 10]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Big_Island.geometry}
          material={materials.ground}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Big_Island_1.geometry}
          material={materials.grass}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Big_Island_2.geometry}
          material={materials.stone}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Big_Island_3.geometry}
          material={materials.lava}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Big_Island_4.geometry}
          material={materials["burnt stone"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Big_Island_5.geometry}
          material={materials.tree}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Big_Island_6.geometry}
          material={materials.water}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Big_Island_7.geometry}
          material={materials.sand}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Big_Island_8.geometry}
          material={materials["foamy water"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Boiling_Water.geometry}
          material={materials.grass}
          position={[0.116, 1.083, 0.559]}
          scale={[0.022, 0.221, 0.022]}
        >
          <boilingWaterMaterial ref={boilingWaterMaterial} />
        </mesh>

        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Lava_Circle.geometry}
          material={materials.grass}
          position={[-0.044, 1.689, 0.438]}
          scale={[0.062, 0.616, 0.062]}
        >
          <volcano1Material ref={surfaceMaterial} />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Water_Circle.geometry}
          material={materials.grass}
          position={[0.29, 1.416, 0.272]}
          scale={[0.023, 0.232, 0.023]}
        >
          <waterCircleMaterial ref={waterCircleMaterial} />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.lava_bowl_1.geometry}
          material={materials.lava}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.lava_bowl_2.geometry}
          material={materials.water}
        />
      </group>
      <group position={[0.173, -0.822, 0.013]} scale={[10, 1, 10]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.ocean_water.geometry}
          material={materials.water}
        >
          <waveMaterial ref={waveMaterial} />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.ocean_water_1.geometry}
          material={materials["foamy water"]}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.SubOcean.geometry}
        material={materials.water}
        position={[0.173, -1.092, 0.013]}
        scale={[10, 1, 10]}
      />
    </group>
  );
}

useGLTF.preload("/island2.glb");
