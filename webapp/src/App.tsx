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
    document.body.onkeydown = (e) => {
      keyPress(e.key)
      render()
    }
  }, [])

  return (
    <div className="App">
      <Canvas canvasRef={canvasRef} />
      <PlayButton onPlay={onPlay} handlePlay={handlePlay} />
    </div>
  )
}

export default App
