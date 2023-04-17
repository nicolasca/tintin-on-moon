import { Center, Text3D, TransformControls } from "@react-three/drei";
import { useControls } from "leva";

export default function Title() {
  const controls = useControls("Title", {
    size: {
      value: 1.5,
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
    color: "white",
  });

  return (
    <>
      <Center position-y={5}>
        <Text3D
          size={controls.size}
          font={"/tintin-font.json"}
          curveSegments={controls.curveSegments}
          bevelEnabled={controls.bevelEnabled}
          bevelThickness={controls.bevelThickness}
          bevelSize={controls.bevelSize}
          bevelOffset={controls.bevelOffset}
          bevelSegments={controls.bevelSegments}
        >
          TINTIN \n
          OBJECTIF LUNE
          <meshStandardMaterial
            color={controls.color}
            metalness={0.9}
            roughness={0.1}
          />
        </Text3D>
      </Center>
    </>
  );
};
