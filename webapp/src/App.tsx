import { useEffect, useRef, useState } from "react"
import "./App.css"
import Canvas from "./components/Canvas"
import PlayButton from "./components/PlayButton"

var COLS = 10,
  ROWS = 20
var board: number[][] = []
var lose: boolean = false
var interval: NodeJS.Timer
var intervalRender: NodeJS.Timer
var current: number[][] // current moving shape
var currentX: number, currentY: number // position of current shape
var freezed: boolean // is current shape settled on the board?
var shapes = [
  [1, 1, 1, 1],
  [1, 1, 1, 0, 1],
  [1, 1, 1, 0, 0, 0, 1],
  [1, 1, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [0, 1, 1, 0, 1, 1],
  [0, 1, 0, 0, 1, 1, 1],
]
var colors = ["cyan", "orange", "blue", "yellow", "red", "green", "purple"]
var W = 300,
  H = 600
var BLOCK_W = W / COLS,
  BLOCK_H = H / ROWS

const App: React.FC<{}> = () => {
  const [onPlay, setOnPlay] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // check if any lines are filled and clear them
  const clearLines = () => {
    for (var y = ROWS - 1; y >= 0; --y) {
      var rowFilled = true
      for (var x = 0; x < COLS; ++x) {
        if (board[y][x] == 0) {
          rowFilled = false
          break
        }
      }
      if (rowFilled) {
        //document.getElementById( 'clearsound' ).play();
        for (var yy = y; yy > 0; --yy) {
          for (var x = 0; x < COLS; ++x) {
            board[yy][x] = board[yy - 1][x]
          }
        }
        ++y
      }
    }
  }
  // stop shape at its position and fix it to board
  const freeze = () => {
    for (var y = 0; y < 4; ++y) {
      for (var x = 0; x < 4; ++x) {
        if (current[y][x]) {
          board[y + currentY][x + currentX] = current[y][x]
        }
      }
    }
    freezed = true
  }
  // checks if the resulting position of current shape will be feasible
  const valid = (
    offsetX: number,
    offsetY?: number,
    newCurrent?: number[][]
  ) => {
    offsetX = offsetX || 0
    offsetY = offsetY || 0
    offsetX = currentX + offsetX
    offsetY = currentY + offsetY
    newCurrent = newCurrent || current

    for (var y = 0; y < 4; ++y) {
      for (var x = 0; x < 4; ++x) {
        if (newCurrent[y][x]) {
          if (
            typeof board[y + offsetY] == "undefined" ||
            typeof board[y + offsetY][x + offsetX] == "undefined" ||
            board[y + offsetY][x + offsetX] ||
            x + offsetX < 0 ||
            y + offsetY >= ROWS ||
            x + offsetX >= COLS
          ) {
            if (offsetY == 1 && freezed) {
              lose = true // lose if the current shape is settled at the top most row
              setOnPlay(false)
              //document.getElementById('playbutton').disabled = false;
            }
            return false
          }
        }
      }
    }
    return true
  }
  // keep the element moving down, creating new shapes and clearing lines
  const tick = () => {
    if (valid(0, 1)) {
      ++currentY
    }
    // if the element settled
    else {
      freeze()
      valid(0, 1)
      clearLines()
      if (lose) {
        clearAllIntervals()
        return false
      }
      newShape()
    }
  }
  // draw a single square at (x, y)
  const drawBlock = (x: number, y: number) => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return

    ctx.fillRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1)
    ctx.strokeRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1)
  }

  // draws the board and the moving shape
  const render = () => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, W, H)

    ctx.strokeStyle = "black"
    for (var x = 0; x < COLS; ++x) {
      for (var y = 0; y < ROWS; ++y) {
        if (board[y][x]) {
          ctx.fillStyle = colors[board[y][x] - 1]
          drawBlock(x, y)
        }
      }
    }

    ctx.fillStyle = "red"
    ctx.strokeStyle = "black"
    for (var y = 0; y < 4; ++y) {
      for (var x = 0; x < 4; ++x) {
        if (current[y][x]) {
          ctx.fillStyle = colors[current[y][x] - 1]
          drawBlock(currentX + x, currentY + y)
        }
      }
    }
  }
  // creates a new 4x4 shape in global variable 'current'
  // 4x4 so as to cover the size when the shape is rotated
  const newShape = () => {
    var id = Math.floor(Math.random() * shapes.length)
    var shape = shapes[id] // maintain id for color filling

    current = []
    for (var y = 0; y < 4; ++y) {
      current[y] = []
      for (var x = 0; x < 4; ++x) {
        var i = 4 * y + x
        if (typeof shape[i] != "undefined" && shape[i]) {
          current[y][x] = id + 1
        } else {
          current[y][x] = 0
        }
      }
    }

    // new shape starts to move
    freezed = false
    // position where the shape will evolve
    currentX = 5
    currentY = 0
  }
  // clears the board
  const init = () => {
    for (var y = 0; y < ROWS; ++y) {
      board[y] = []
      for (var x = 0; x < COLS; ++x) {
        board[y][x] = 0
      }
    }
  }
  const clearAllIntervals = () => {
    clearInterval(interval)
    clearInterval(intervalRender)
  }
  const newGame = () => {
    clearAllIntervals()
    intervalRender = setInterval(render, 30)
    init()
    newShape()
    lose = false
    interval = setInterval(tick, 400)
  }
  const handlePlay = () => {
    setOnPlay(true)
    newGame()
  }

  // returns rotates the rotated shape 'current' perpendicularly anticlockwise
  const rotate = (current: number[][]) => {
    var newCurrent: number[][] = []
    for (var y = 0; y < 4; ++y) {
      newCurrent[y] = []
      for (var x = 0; x < 4; ++x) {
        newCurrent[y][x] = current[3 - x][y]
      }
    }

    return newCurrent
  }
  const keyPress = (key: string) => {
    switch (key) {
      case "left":
        if (valid(-1)) {
          --currentX
        }
        break
      case "right":
        if (valid(1)) {
          ++currentX
        }
        break
      case "down":
        if (valid(0, 1)) {
          ++currentY
        }
        break
      case "rotate":
        var rotated = rotate(current)
        if (valid(0, 0, rotated)) {
          current = rotated
        }
        break
      case "drop":
        while (valid(0, 1)) {
          ++currentY
        }
        tick()
        break
    }
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
