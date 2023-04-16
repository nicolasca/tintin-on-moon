import { Box, OrbitControls, Plane, Sky, Stars, Torus, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Debug, Physics, RigidBody } from '@react-three/rapier'
import { Perf } from 'r3f-perf'
import { useMemo, useRef, useState } from 'react'
import Rocket from './Rocket'

export default function Experience() {

    const [hasTakenOff, setHasTakenOff] = useState(false)
    const [startTime, setStartTime] = useState(0)

    const rocketRef = useRef()

    // Parameters
    const maxAccel = 2; // Maximum acceleration in m/s^2
    const steepness = 0.1; // Controls the slope of the sigmoid function
    const timeShift = 7; // Time in seconds when the maximum acceleration occurs

    const startRocket = () => {
        console.log("Landing started!")
        setTimeout(() => {
            console.log("Landing finished!")
            setHasTakenOff(true)
        }, 1000)
    }

    const acceleration = (time, maxAccel, steepness, timeShift) => {
        return maxAccel / (1 + Math.exp(-steepness * (time - timeShift)));
    }

    useFrame(({ clock }) => {
        if (!startTime) {
            setStartTime(clock.getElapsedTime())
        }

        if (hasTakenOff) {
            const time = clock.getElapsedTime() - startTime
            const currentVelocity = rocketRef.current.linvel().y
            const acc = acceleration(time, maxAccel, steepness, timeShift);
            const newVelocity = currentVelocity + acc / 5;
            console.log("velocity", newVelocity)
            rocketRef.current.setLinvel({ x: 0, y: newVelocity, z: 0 })
        }
    })


    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight castShadow position={[-1, 2, 3]} intensity={1.5} />
        <ambientLight intensity={0.5} />

        <color  attach="background" args={['#000']} />
        <Stars radius={50} depth={10} count={10000} factor={1} saturation={0} fade speed={1} />

        <Physics>

            {/* <Debug /> */}

            <RigidBody type='fixed'>
                <Box
                    receiveShadow
                    args={[50, 50, 0.5]}
                    rotation-x={-Math.PI * 0.5}
                  >
                        <meshStandardMaterial color="#BBA458" />
                    </Box>
            </RigidBody>

            <RigidBody ref={rocketRef} colliders="cuboid" scale={0.3}>
                <Rocket onClick={startRocket} />
            </RigidBody>
        </Physics>

    </>
}