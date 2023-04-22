import { Canvas, useFrame } from "@react-three/fiber"
import { useEffect, useState } from "react"
import classes from "./App.module.css"
import TintinTakeOff from "./TintinTakeOff"

export const DEBUG = true


export default function App() {

    const [isTintinTakingOff, setIsTintinTakingOff] = useState(false)
    const [isOnAcidTakingOff, setIsOnAcidTakingOff] = useState(false)


    return (
        <>
            {(!isOnAcidTakingOff && !isTintinTakingOff) &&

                <div className={classes.chooseTakeOff}>
                    <button
                        className={`${classes.buttonTakeOff} + ${classes.regularStyle}`}
                        onClick={() => setIsTintinTakingOff(true)}
                    >
                        Tintin style take off
                    </button>
                    <button
                        className={`${classes.buttonTakeOff} + ${classes.acidStyle}`}
                    >
                        Tintin on acid style take off
                    </button>
                </div>
            }


            <Canvas
                shadows
                camera={{
                    position: [0, 5, 15]
                }}
            >

                <color attach="background" args={['#000']} />
                {
                    isTintinTakingOff &&
                    <TintinTakeOff />
                }
            </Canvas>
        </>

    )
}
