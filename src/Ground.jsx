import { Box } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

export default function Ground() {
    return (
        <RigidBody type='fixed'>
            <Box
                receiveShadow
                args={[20, 20, 0.5]}
                rotation-x={-Math.PI * 0.5}
            >
                <meshStandardMaterial
                    color="#C1AD66"
                />
            </Box>
        </RigidBody>
    )
}