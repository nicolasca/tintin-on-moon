import { Box, Circle } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

export default function Ground() {
    return (
        <RigidBody type='fixed'>
            <Circle
                receiveShadow
                args={[7, 40]}
                rotation-x={-Math.PI * 0.5}
            >
                <meshStandardMaterial
                    color="#C1AD66"
                />
            </Circle>
        </RigidBody>
    )
}