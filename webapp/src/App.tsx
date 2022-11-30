import { useState } from "react"
import "./App.css"

const App: React.FC<{}> = () => {
  const [onPlay, setOnPlay] = useState(false)

  const handlePlay = () => {
    setOnPlay(true)
  }

  return (
    <div className="App">
      <canvas width="300" height="600" />
      <button id="playbutton" disabled={onPlay} onClick={handlePlay}>
        Play
      </button>
    </div>
  )
}

export default App
