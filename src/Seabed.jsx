import { Canvas } from "@react-three/fiber";
import { Plane } from "@react-three/drei";

function Seabed() {
  return (
    <Plane
      args={[1110, 1110]} // Width and height of the plane
      rotation={[-Math.PI / 2, 0, 0]} // Rotate to lie flat (floor)
      position={[0, -1.0, 0]} // Position at y=0
    >
      <meshStandardMaterial color="#368be3" /> {/* Blue material */}
    </Plane>
  );
}

export default Seabed;
