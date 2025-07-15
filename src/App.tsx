import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Mesh, MeshStandardMaterial } from "three";
import "./App.css";

// return cube 
function Cube({
  position,
  color,
  onClick,
  name,
  selected,
}: {
  position: [number, number, number];
  color: string;
  onClick: (e: any) => void;
  name: string;
  selected: boolean;
}) {
  const meshRef = useRef<Mesh>(null);

  // rotate cube
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
    }
  });

  // clicking on each cube should give you mesh data and each mesh should have a UUID or some other three.js identification that you can then place into the react panel
  return (
    // raycasting is onPointerDown
    <mesh position={position} ref={meshRef} onPointerDown={onClick} uuid={name}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export default function App() {
  const [selectedCube, setSelectedCube] = useState<{
    uuid: string;
    color: string;
    cubeName: string;
  } | null>(null);

  const handleCubeClick = (e: any) => {
    const mesh = e.object as Mesh;
    const material = mesh.material as MeshStandardMaterial | undefined;

    console.log(material)

    // material can be an array, output is RGBA + boolean
    const color = material?.color?.getHexString()
      ? `#${material.color.getHexString()}`
      : "#ffffff";

    setSelectedCube({
      uuid: mesh.uuid,
      color,
      cubeName: selectedCube?.cubeName || 'leftCube'
    });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCube) return;

    console.log("cube name", selectedCube.cubeName)
    const newColor = e.target.value;
    setSelectedCube((prev) => (prev ? { ...prev, color: newColor } : prev));
  };

  return (
    <div className="canvas">
      {/* Left side, canvas. Right side, react panel */}
      <div className="left">
        <Canvas>
          {/* lighting to see the cubes */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[1, 1, 1]} />

          <Cube
            position={[-1, 0, 0]}
            color={
              selectedCube?.cubeName === "leftCube" ? selectedCube.color : "#F00CEC"
            }
            onClick={handleCubeClick}
            name="leftCube"
            selected={selectedCube?.cubeName === "leftCube"}
          />
          <Cube
            position={[1, 0, 0]}
            color={
              selectedCube?.cubeName === "rightCube"
                ? selectedCube.color
                : "#F01A0C"
            }
            onClick={handleCubeClick}
            name="rightCube"
            selected={selectedCube?.cubeName === "rightCube"}
          />
        </Canvas>
      </div>

      <div className="right">
        {/* if there is a selected cube, show data */}
        {selectedCube && <h3>Selected Cube</h3>}
        {selectedCube ? (
          <div className="selected-description">
            <p>
              <b>UUID:</b> {selectedCube.uuid}
            </p>
            <p>
              <b>COLOR:</b> {selectedCube.color}
            </p>
            {/* Bonus, recolor the cubes,  let me select a color to change a cube to */}
            <p className="change-color">
              <b>Change color of selected cube: </b>
              <input
                type="color"
                value={selectedCube.color}
                onChange={handleColorChange}
              />
            </p>
          </div>
        ) : (
          <p>Click a cube to see its information!</p>
        )}
      </div>
    </div>
  );
}