import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Vector3 } from "three";

const OrbitingModel = ({
  url, // URL to the GLB file
  radius = 5,
  period = 12,
  color = "#ffffff",
  center = { x: 0, y: 0, z: 0 },
  scale = 1,
  forwardAxis = [-1, 0, 0], // Default: nose points along +X
  bobDistance = 1.25,
  bobPeriod = 1,
  rotationDirection = 1,
  pulseSpeed = 2.0,
  glowIntensity = 1.5,
  glowThickness = 2.0,
}) => {
  const gltf = useGLTF(url);
  const meshRef = useRef();
  const timeRef = useRef(0);
  const textMaterialRef = useRef();

  //create a 'neon effect' shader material, for the blimp sign
  const neonMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        glowColor: { value: new THREE.Vector3(0.0, 1.0, 0.0) },
        pulseSpeed: { value: 5.0 },
        glowIntensity: { value: 0.9 },
        glowThickness: { value: 2.0 },
        transparent: true,
        depthWrite: false,
        depthTest: false,
      },
      side: THREE.DoubleSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexShader: `
          varying vec3 vNormal;   // Pass normal to fragment shader
          varying vec3 vViewDir;  // Pass view direction to fragment shader

          void main() {
              // Transform normal to world space using normalMatrix
              vNormal = normalize(normalMatrix * normal);

              // Compute world position of the vertex
              vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;

              // Compute view direction (from vertex to camera)
              vViewDir = cameraPosition - worldPos;

              // Compute vertex position in clip space
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
      `,
      fragmentShader: `
            uniform vec3 glowColor;      // Neon color (e.g., vec3(0.0, 1.0, 1.0) for cyan)
            uniform float glowIntensity; // Glow strength (e.g., 1.0 to 5.0)
            uniform float glowThickness;    // Glow radius (e.g., 0.1 to 0.3)
            uniform float time;          // Optional: for pulsing effect


            varying vec3 vNormal;
            varying vec3 vViewDir;

            void main() {
                float edge = abs(dot(normalize(vNormal), normalize(vViewDir)));
                float glow = smoothstep(0.0, glowThickness, edge);
                float core = smoothstep(glowThickness * 0.5, glowThickness, edge);

                float pulseFactor = sin(time * 4.0) * 0.5 + 0.5;

                // Emphasize the core (edges) with a higher multiplier
                float emphasizedCore = core * 2.0; // Adjust this multiplier

                // Add a very bright, narrow glow at the extreme edges
                float extremeEdge = smoothstep(glowThickness * 0.8, glowThickness, edge);
                float extremeGlow = extremeEdge * 3.0 * pulseFactor; // Make it pulse too

                float modulatedGlowIntensity = emphasizedCore + (1.0 - glow) * glowIntensity * pulseFactor * 3.0 + extremeGlow;

                float alpha = smoothstep(0.1, 0.9, modulatedGlowIntensity) * pulseFactor * 1.5;
                alpha = clamp(alpha, 0.0, 1.0);

                vec3 color = glowColor * modulatedGlowIntensity * 1.3;
                gl_FragColor = vec4(color, alpha);
            }
      `,
    });
  }, [color, pulseSpeed, glowIntensity, glowThickness]);

  // Clone the GLTF scene and materials to allow multiple instances
  // otherwise you get the same material for all instances
  // and they all change color when one is changed
  // This is a shallow clone of the scene, but we need to deep clone the materials
  // to avoid sharing them between instances
  const clonedScene = useMemo(() => {
    // Clone the scene (shallow clone for structure)
    const sceneClone = gltf.scene.clone();

    // Deep clone materials to avoid sharing
    const materialMap = new Map();
    Object.entries(gltf.materials).forEach(([name, material]) => {
      materialMap.set(name, material.clone());
    });

    // Traverse the cloned scene to assign cloned materials
    sceneClone.traverse((child) => {
      if (child.isMesh && child.material) {
        const materialName = child.material.name;
        if (materialMap.has(materialName)) {
          child.material = materialMap.get(materialName);
        }
      }
    });

    return sceneClone;
  }, [gltf]);

  // Create a new material with the custom color
  const customMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.5,
      metalness: 0.5,
    });
  }, [color]);

  // Traverse the GLTF scene to find the mesh with the 'fish body - wave' material
  useMemo(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material?.name === "fish body - wave") {
        child.material = customMaterial;
      }
      //also do a check for the signage material in the blimp
      // and replace it with the neon shader material
      // this is a bit of a hack, but it works
      if (child.isMesh && child.material?.name === "signage") {
        child.material = neonMaterial;
        textMaterialRef.current = neonMaterial;
      }
    });
  }, [clonedScene, customMaterial]);

  // Normalize scale to an array [x, y, z]
  const scaleArray = useMemo(() => {
    if (typeof scale === "number") {
      return [scale, scale, scale];
    }
    return [scale.x || 1, scale.y || 1, scale.z || 1];
  }, [scale]);

  // Normalize forwardAxis to a Vector3
  const forwardAxisVector = useMemo(() => {
    return new THREE.Vector3(...forwardAxis).normalize();
  }, [forwardAxis]);

  // Animation loop for circular motion
  useFrame((state, delta) => {
    if (meshRef.current) {
      timeRef.current += delta;
      const angle =
        (timeRef.current % period) *
        ((2 * Math.PI) / period) *
        rotationDirection;

      // Update position in a circular pattern
      meshRef.current.position.x = center.x + radius * Math.cos(angle);
      meshRef.current.position.y = center.y;
      meshRef.current.position.z = center.z + radius * Math.sin(angle);

      const verticalOffset =
        bobDistance * Math.sin((timeRef.current * (2 * Math.PI)) / bobPeriod);
      meshRef.current.position.y += verticalOffset;

      // Compute the tangent direction (velocity vector, counterclockwise)
      const tangent = new THREE.Vector3(
        -radius * Math.sin(angle) * rotationDirection, // dx/dt
        0, // dy/dt (no Y motion)
        radius * Math.cos(angle) * rotationDirection // dz/dt
      ).normalize();

      const lookAtPosition = new Vector3().addVectors(
        meshRef.current.position,
        tangent
      );
      meshRef.current.lookAt(lookAtPosition);

      if (textMaterialRef.current) {
        //used to update the neon shader
        textMaterialRef.current.uniforms.time.value = state.clock.elapsedTime;
      }
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={clonedScene}
      scale={scaleArray}
      position={[0, 0, 0]}
    />
  );
};

export default OrbitingModel;
