import "./App.css"

function App() {
  return (
    <div className="App">
      <canvas width="300" height="600" />
      <button id="playbutton" onClick={() => console.log("PLAY")}>Play</button>
    </div>
  )
}

export default App
