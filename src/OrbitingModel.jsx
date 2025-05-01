import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Vector3 } from "three";

const OrbitingModel = ({
  url, // URL to the GLTF file
  radius = 5,
  period = 12,
  color = "#ffffff",
  center = { x: 0, y: 0, z: 0 },
  scale = 1,
  forwardAxis = [-1, 0, 0], // Default: nose points along +X
  bobDistance = 1.25,
  bobPeriod = 1,
  rotationDirection = 1,
}) => {
  const gltf = useGLTF(url);
  const meshRef = useRef();
  const timeRef = useRef(0);

  // Clone the GLTF scene and materials to allow multiple instances
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

      // // Set quaternion to align forwardAxis with tangent
      // const quaternion = new THREE.Quaternion().setFromUnitVectors(
      //   forwardAxisVector,
      //   tangent
      // );
      // meshRef.current.quaternion.copy(quaternion);
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
