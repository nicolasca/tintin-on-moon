import { Box, CameraControls, CameraShake, Circle, Cloud, GizmoHelper, GizmoViewport, GradientTexture, Html, Image, Stars } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Debug, Physics, RigidBody } from '@react-three/rapier'
import { Perf } from 'r3f-perf'
import { useEffect, useMemo, useRef, useState } from 'react'
import Ground from './Ground'
import Rocket from './Rocket'
import Title from './Title'
import * as THREE from 'three'
import classes from "./App.module.css"
import { DEBUG } from './App'
import { ChromaticAberration, EffectComposer, Noise } from '@react-three/postprocessing'
import { Leva, useControls } from 'leva'

const TIME_BEFORE_TAKE_OFF = 1000 // in milliseconds
const MOON_POSITION_Y = 10

export default function AcidTakeOff() {

    const [startTime, setStartTime] = useState(0)
    const [timeLeft, setTimeLeft] = useState(null);
    const [isCountDown, setIsCountDown] = useState(false)

    const [cameraTarget] = useState(() => new THREE.Vector3())
    const [smoothedCameraTarget] = useState(() => new THREE.Vector3())
    const [cameraPosition] = useState(() => new THREE.Vector3())
    const [smoothedCameraPosition] = useState(() => new THREE.Vector3())

    const [rocketAudio] = useState(() => new Audio('/sounds/rocket.mp3'))
    const [countDownAudio] = useState(() => new Audio('/sounds/countdown.m4a'))
    const [wheeAudio] = useState(() => new Audio('/sounds/whee-full.m4a'))

    const [isTakingOff, setIsTakingOff] = useState(false)
    const [hasMetTheMoon, setMetTheMoon] = useState(false)

    const rocketRef = useRef()
    const cameraControlRef = useRef(null)
    const cameraShakeRef = useRef(null)
    const isAnimationOver = useRef(null)

    const dayColor = new THREE.Color(0xEC168F);
    const nightColor = new THREE.Color(0x000000);

    useEffect(() => {
        if (isCountDown) {
            timeLeft > 0 && setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        }
    }, [isCountDown, timeLeft]);

    const { offset } = useControls({
        offset: {
            value: [0.01, 0.002]
        }
    });


    // Parameters for take off
    const maxAccel = 2; // Maximum acceleration in m/s^2
    const steepness = 0.1; // Controls the slope of the sigmoid function
    const timeShift = 7; // Time in seconds when the maximum acceleration occurs

    const startRocket = () => {
        setTimeout(() => {
            setTimeLeft(6)
        }, 800)
        countDownAudio.currentTime = 0
        countDownAudio.volume = 0.5
        // countDownAudio.play()

        setTimeout(() => {
            rocketAudio.currentTime = 0
            rocketAudio.volume = 0.25
            // rocketAudio.play()
        }, TIME_BEFORE_TAKE_OFF)

        setTimeout(() => {
            setIsTakingOff(true)
        }, TIME_BEFORE_TAKE_OFF)
    }

    const acceleration = (time, maxAccel, steepness, timeShift) => {
        return maxAccel / (1 + Math.exp(-steepness * (time - timeShift)));
    }

    useEffect(() => {
        const cameraTranslate = async () => {
            await cameraControlRef.current.setLookAt(7, 6, 8, -3, 0, 0, true)
            startRocket()
        }

        if (isCountDown) {
            cameraTranslate()
        }
    }, [isCountDown])

    useFrame(({ camera, clock, scene }) => {
        if (isCountDown) {
            scene.background.lerp(nightColor, 0.05);
        }

        if (isTakingOff && !startTime) {
            setStartTime(clock.getElapsedTime())
        }

        if (isTakingOff && startTime) {
            const time = clock.getElapsedTime() - startTime
            const currentVelocity = rocketRef.current.linvel().y
            const acc = acceleration(time, maxAccel, steepness, timeShift);
            const newVelocity = currentVelocity + acc / 5;
            rocketRef.current.setLinvel({ x: 0, y: newVelocity, z: 0 })

            if (rocketRef.current.translation().y > 5) {
                camera.lookAt(rocketRef.current.translation())

            } else {
                camera.position.y = rocketRef.current.translation().y + 6
            }
        }


        // if (rocketRef.current.translation().y > MOON_POSITION_Y - 5.5 && !isAnimationOver.current) {
        //     console.log("I want to stop animation")
        //     isAnimationOver.current = true
        //     rocketRef.current.setLinvel({ x: 0, y: 0, z: 0 })
        //     rocketRef.current.setEnabledTranslations(false, false, false)
        //     camera.position.y = rocketRef.current.translation().y + 6
        //     cameraShakeRef.current.intensity = 0
        //     wheeAudio.currentTime = 0
        //     wheeAudio.volume = 0.5
        //     rocketAudio.pause()
        //     wheeAudio.play()
        // }
    })


    return <>

        {DEBUG &&
            <>
                <GizmoHelper
                    alignment="bottom-right" // widget alignment within scene
                    margin={[80, 80]} // widget margins (X, Y)
                >
                    <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
                </GizmoHelper>
                <Perf position="bottom-left" />

            </>
        }


        <CameraControls makeDefault
            fov={60}
            near={0.1}
            far={200}
            smoothTime={1}
            maxPolarAngle={Math.PI / 2 - 0.2}
            ref={cameraControlRef}
        />

        <Html transform={false} wrapperClass={classes.information}>
            <div >
                <button className={classes.buttonTakeOff} onClick={() => setIsCountDown(true)}>Take off mille sabords! </button>
                {timeLeft !== null && <p className={classes.counter}>{timeLeft === 0 ? "On va marcher sur la lune !" : "Countdown: " + timeLeft}</p>}
            </div>
        </Html>


        <Title isCountingDown={isCountDown} />

        <directionalLight castShadow position={[-1, 2, 3]} intensity={1} />
        <ambientLight intensity={0.1} />

        <color attach="background" args={[0xA0F962]} />
        <fog attach="fog" args={[0xEC168F, 15, 40]} />

        {/* <Image url="/moon-butt.png" transparent position={[0, MOON_POSITION_Y, 0]} scale={10} rotation={[0, 0, -0.5]} /> */}


        <Physics timeStep="vary">
            <RigidBody type='fixed'>
                <Circle
                    receiveShadow
                    args={[7, 40]}
                    rotation-x={-Math.PI * 0.5}
                >
                    <meshBasicMaterial>
                        <GradientTexture
                            stops={[0, 0.8]} // As many stops as you want
                            colors={['#EC168F', '#0001EF']} // Colors need to match the number of stops
                            size={1024} // Size is optional, default = 1024
                        />
                    </meshBasicMaterial>
                </Circle>

            </RigidBody>

            <RigidBody ref={rocketRef} colliders="cuboid" scale={0.3}>
                <Rocket />
            </RigidBody>
        </Physics>

        <EffectComposer>
            <ChromaticAberration offset={offset} />
        </EffectComposer>

    </>
}