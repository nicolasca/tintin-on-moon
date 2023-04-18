import { Canvas, useFrame } from "@react-three/fiber"
import Experience from "./Experience"
import { useEffect, useState } from "react"
import classes  from "./App.module.css"


export default function App() {

    const [isCountDown, setIsCountDown] = useState(false)
    const [timeLeft, setTimeLeft] = useState(null);

    const handleCountDown = () => {   
        setIsCountDown(true)
    }

    useEffect(() => {
        if (isCountDown) {
            timeLeft > 0 && setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        }
      }, [isCountDown, timeLeft]);

    return (
        <>
        <div className={classes.information}>
            <button className={classes.buttonTakeOff} onClick={handleCountDown}>Take off mille sabords! </button>
            {timeLeft !== null && <p className={classes.counter}>{timeLeft === 0 ? "On va marcher sur la lune !" : "Countdown: "+ timeLeft }</p>}
        </div>
        <Canvas
            shadows
            camera={{
                position:[0, 5, 15]}}
        >
            <Experience isCountDown={isCountDown} starTimer={() => setTimeLeft(6)}/>
        </Canvas>
        </>

    )
    }
    