import { Canvas, useFrame } from "@react-three/fiber"
import { useEffect, useState } from "react"
import classes from "./App.module.css"
import TintinTakeOff from "./TintinTakeOff"
import AcidTakeOff from "./AcidTakeOff"

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
                        Tintin on the Moon: classical style
                    </button>
                    <button
                        className={`${classes.buttonTakeOff} + ${classes.acidStyle}`}
                        onClick={() => setIsOnAcidTakingOff(true)}
                    >
                       Tintin on the Moon: acid style
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
                {isTintinTakingOff &&
                    <TintinTakeOff />
                }
                 {isOnAcidTakingOff &&
                    <AcidTakeOff />
                }
            </Canvas>
        </>

    )
}
