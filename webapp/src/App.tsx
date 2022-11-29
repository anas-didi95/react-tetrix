import { useRef } from "react"
import "./App.css"
import sound from "./assets/sound_pop.ogg"
import logo from "./logo.svg"

function App() {
  const audioRef = useRef<HTMLAudioElement>(null)

  const handlePlaySound = async () => {
    const audio = new Audio(sound)
    await audio.play()
  }

  return (
    <div className="App">
      <audio id="clearsound" ref={audioRef} src={sound} preload="auto" />
      <header className="App-header">
        <button onClick={handlePlaySound}>Play sound</button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
