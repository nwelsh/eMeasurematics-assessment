import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Mesh, MeshStandardMaterial, Color, Raycaster, Vector2 } from "three";
import "./App.css";

function Cube({
  position,
  color,
  name,
}: {
  position: [number, number, number];
  color: string;
  name: string;
}) {
  const meshRef = useRef<Mesh>(null);

  useEffect(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as MeshStandardMaterial;
      material.color = new Color(color);
    }
  }, [color]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={meshRef} position={position} name={name}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Raycasting({
  onSelect,
}: {
  onSelect: (uuid: string, cubeName: string) => void;
}) {
  const raycaster = useRef(new Raycaster());
  const mouse = useRef(new Vector2());
  const { camera, scene, gl } = useThree();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);

      const intersects = raycaster.current.intersectObjects(scene.children);
      if (intersects.length > 0) {
        const mesh = intersects[0].object as Mesh;
        onSelect(mesh.uuid, mesh.name);
      }
    };

    gl.domElement.addEventListener("click", handleClick);
    return () => gl.domElement.removeEventListener("click", handleClick);
  }, [camera, scene, gl, onSelect]);

  return null;
}

export default function App() {
  const [cubeColors, setCubeColors] = useState({
    leftCube: "#F00CEC",
    rightCube: "#F01A0C",
  });

  const [selectedCube, setSelectedCube] = useState<{
    uuid: string;
    cubeName: string;
  } | null>(null);

  const handleSelect = (uuid: string, cubeName: string) => {
    setSelectedCube({ uuid, cubeName });
  };

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
      <Canvas className="left">
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 1, 1]} />

        <Cube
          position={[-1, 0, 0]}
          color={cubeColors.leftCube}
          name="leftCube"
        />
        <Cube
          position={[1, 0, 0]}
          color={cubeColors.rightCube}
          name="rightCube"
        />

        <Raycasting onSelect={handleSelect} />
      </Canvas>

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
