import { Box, useTexture } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";


useTexture.preload('/ground/sand-ao.jpg')
useTexture.preload('/ground/sand-height.jpg')
useTexture.preload('/ground/sand-normal.jpg')
useTexture.preload('/ground/sand-rough.jpg')

export default function Ground() {

    const ao = useTexture('/ground/sand-ao.jpg')
    const height = useTexture('/ground/sand-height.jpg')
    const normal = useTexture('/ground/sand-normal.jpg')
    const roughness = useTexture('/ground/sand-rough.jpg')

    return (
        <RigidBody type='fixed'>
            <Box
                receiveShadow
                args={[50, 50, 0.5]}
                rotation-x={-Math.PI * 0.5}
            >
                <meshStandardMaterial
                    aoMap={ao}
                    aoMapIntensity={1}
                    displacementMap={height}
                    displacementScale={0.2}
                    normalMap={normal}
                    // map
                    roughnessMap={roughness}
                    roughness={1}
                    metalness={0}
                    color="#b58747"
                />
            </Box>
        </RigidBody>
    )
}