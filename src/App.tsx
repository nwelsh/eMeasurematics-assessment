import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Mesh, MeshStandardMaterial, Color } from "three";
import "./App.css";

// Cube component
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

  // Keep material color in sync with prop
  useEffect(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as MeshStandardMaterial;
      material.color = new Color(color);
    }
  }, [color]);

  // Rotation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh position={position} ref={meshRef} onPointerDown={onClick} name={name}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export default function App() {
  // ✅ Store both cubes' colors independently
  const [cubeColors, setCubeColors] = useState({
    leftCube: "#F00CEC",
    rightCube: "#F01A0C",
  });

  // ✅ Selected cube just tracks name & uuid
  const [selectedCube, setSelectedCube] = useState<{
    uuid: string;
    cubeName: string;
  } | null>(null);

  // When you click a cube
  const handleCubeClick = (e: any) => {
    const mesh = e.object as Mesh;

    setSelectedCube({
      uuid: mesh.uuid,
      cubeName: mesh.name,
    });
  };

  // Color change updates the correct cube's color
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCube) return;

    const newColor = e.target.value;

    setCubeColors((prev) => ({
      ...prev,
      [selectedCube.cubeName]: newColor,
    }));
  };

  return (
    <div className="canvas">
      <div className="left">
        <Canvas>
          <ambientLight intensity={0.5} />
          <directionalLight position={[1, 1, 1]} />

          <Cube
            position={[-1, 0, 0]}
            color={cubeColors.leftCube}
            onClick={handleCubeClick}
            name="leftCube"
            selected={selectedCube?.cubeName === "leftCube"}
          />
          <Cube
            position={[1, 0, 0]}
            color={cubeColors.rightCube}
            onClick={handleCubeClick}
            name="rightCube"
            selected={selectedCube?.cubeName === "rightCube"}
          />
        </Canvas>
      </div>

      <div className="right">
        {selectedCube && <h3>Selected Cube</h3>}
        {selectedCube ? (
          <div className="selected-description">
            <p>
              <b>UUID:</b> {selectedCube.uuid}
            </p>
            <p>
              <b>COLOR:</b> {cubeColors[selectedCube.cubeName]}
            </p>
            <p className="change-color">
              <b>Change color of selected cube: </b>
              <input
                type="color"
                value={cubeColors[selectedCube.cubeName]}
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
