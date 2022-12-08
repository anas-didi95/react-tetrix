import { useEffect, useState } from "react"
import "./App.css"
import Canvas from "./components/Canvas"
import PlayButton from "./components/PlayButton"
import { useGameContext } from "./contexts/GameContext"
import { newGame, render, keyPress } from "./utils/engine"

const App: React.FC<{}> = () => {
  const [onPlay, setOnPlay] = useState(false)
  const { canvasRef } = useGameContext()

  const handlePlay = () => {
    setOnPlay(true)
    newGame(canvasRef)
  }

  useEffect(() => {
    document.body.onkeydown = function (e) {
      var keys = {
        37: "left",
        39: "right",
        40: "down",
        38: "rotate",
        32: "drop",
      }
      //@ts-ignore
      if (typeof keys[e.keyCode] != "undefined") {
        //@ts-ignore
        keyPress(keys[e.keyCode])
        render()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="App">
      <Canvas canvasRef={canvasRef} />
      <PlayButton onPlay={onPlay} handlePlay={handlePlay} />
    </div>
  )
}

export default App
