import { Box, CameraShake, GizmoHelper, GizmoViewport, OrbitControls, Plane, Sky, Stars, Torus, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Debug, Physics, RigidBody } from '@react-three/rapier'
import { Perf } from 'r3f-perf'
import { useMemo, useRef, useState } from 'react'
import Rocket from './Rocket'

export default function Experience() {

    const [hasTakenOff, setHasTakenOff] = useState(false)
    const [startTime, setStartTime] = useState(0)
    const [rocketAudio] = useState(() => new Audio('/rocket.mp3'))

    const rocketRef = useRef()

    // Parameters
    const maxAccel = 2; // Maximum acceleration in m/s^2
    const steepness = 0.1; // Controls the slope of the sigmoid function
    const timeShift = 7; // Time in seconds when the maximum acceleration occurs

    const startRocket = () => {
        console.log("Landing started!")
        rocketAudio.currentTime = 0
        rocketAudio.volume = 0.25
        rocketAudio.play()
        setTimeout(() => {
            setHasTakenOff(true)
        }, 1000)
    }

    const acceleration = (time, maxAccel, steepness, timeShift) => {
        return maxAccel / (1 + Math.exp(-steepness * (time - timeShift)));
    }

    useFrame(({camera, clock }) => {
        if (!startTime) {
            setStartTime(clock.getElapsedTime())
        }

        if (hasTakenOff) {
            const time = clock.getElapsedTime() - startTime
            const currentVelocity = rocketRef.current.linvel().y
            const acc = acceleration(time, maxAccel, steepness, timeShift);
            const newVelocity = currentVelocity + acc / 5;
            rocketRef.current.setLinvel({ x: 0, y: newVelocity, z: 0 })

            camera.position.y = rocketRef.current.translation().y + 6
            // camera.lookAt( new THREE.Vector3(rocketRef.current.translation()))

            // if (clock.getElapsedTime() - startTime > 5 && camera.position.z < 35) {
            //     camera.position.z += rocketRef.current.translation().z + 0.01
            // }
        }


    })


    return <>

        <GizmoHelper
            alignment="bottom-right" // widget alignment within scene
            margin={[80, 80]} // widget margins (X, Y)
        >
            <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
            {/* alternative: <GizmoViewcube /> */}
        </GizmoHelper>

        <Perf position="top-left" />

        <OrbitControls />

        {hasTakenOff &&
        <CameraShake maxYaw={0.02} yawFrequency={10} maxPitch={0} maxRoll={0} intensity={0.5}/> }

        <directionalLight castShadow position={[-1, 2, 3]} intensity={1.5} />
        <ambientLight intensity={0.5} />

        <color attach="background" args={['#000']} />
        <Stars radius={100} depth={20} count={10000} factor={1} saturation={0} fade speed={1} />

        <Physics timeStep="vary">
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