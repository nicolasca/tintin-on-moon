import { Center, Text3D, TransformControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls, Leva } from "leva";
import { useRef } from "react";
import * as THREE from "three";

export default function Title({isCountingDown}) {

  const materialRef = useRef();

  const controls = useControls("Title", {
    size: {
      value: 0.6,
      min: 0.1,
      max: 5,
      step: 0.01,
    },
    curveSegments: 10,
    bevelEnabled: true,
    bevelThickness: {
      value: 0.01,
      min: 0.001,
      max: 0.1,
      step: 0.001,
    },
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 10,
    color: "#222222",
  });

  const text = `
      TINTIN
          *
  OBJECTIF LUNE
  `

  useFrame(({ clock }) => {
    if (isCountingDown) {
      materialRef.current.color.lerp(new THREE.Color(0xffffff), 0.05);
      controls.size = 0.6 + Math.sin(clock.getElapsedTime() * 2) * 0.1;
    }
  });




  return (
    <>
      <Leva hidden />
      <Center top left position-y={5}>
        <Text3D
          size={controls.size}
          font={"/fonts/tintin-bold.json"}
          curveSegments={controls.curveSegments}
          bevelEnabled={controls.bevelEnabled}
          bevelThickness={controls.bevelThickness}
          bevelSize={controls.bevelSize}
          bevelOffset={controls.bevelOffset}
          bevelSegments={controls.bevelSegments}
          letterSpacing={0.2}
        >
          {text}
          <meshStandardMaterial
            ref={materialRef}
            color={controls.color}
            metalness={0.2}
            roughness={0.9}
          />
        </Text3D>
      </Center>
    </>
  );
};
