import { RefObject } from "react"
import { WIDTH, COLS, HEIGHT, ROWS, COLORS, SHAPES } from "./contants"

let board: number[][] = []
let lose: boolean = false
let interval: NodeJS.Timer
let intervalRender: NodeJS.Timer
let current: number[][] // current moving shape
let currentX: number, currentY: number // position of current shape
let freezed: boolean // is current shape settled on the board?
let BLOCK_W = WIDTH / COLS,
  BLOCK_H = HEIGHT / ROWS
let canvasRef: RefObject<HTMLCanvasElement> | null

// check if any lines are filled and clear them
function clearLines() {
  for (let y = ROWS - 1; y >= 0; --y) {
    let rowFilled = true
    for (let x = 0; x < COLS; ++x) {
      if (board[y][x] === 0) {
        rowFilled = false
        break
      }
    }
    if (rowFilled) {
      //document.getElementById( 'clearsound' ).play();
      for (let yy = y; yy > 0; --yy) {
        for (let x = 0; x < COLS; ++x) {
          board[yy][x] = board[yy - 1][x]
        }
      }
      ++y
    }
  }
}

// stop shape at its position and fix it to board
function freeze() {
  for (let y = 0; y < 4; ++y) {
    for (let x = 0; x < 4; ++x) {
      if (current[y][x]) {
        board[y + currentY][x + currentX] = current[y][x]
      }
    }
  }
  freezed = true
}

// checks if the resulting position of current shape will be feasible
function valid(offsetX: number, offsetY?: number, newCurrent?: number[][]) {
  offsetX = offsetX || 0
  offsetY = offsetY || 0
  offsetX = currentX + offsetX
  offsetY = currentY + offsetY
  newCurrent = newCurrent || current

  for (let y = 0; y < 4; ++y) {
    for (let x = 0; x < 4; ++x) {
      if (newCurrent[y][x]) {
        if (
          typeof board[y + offsetY] == "undefined" ||
          typeof board[y + offsetY][x + offsetX] == "undefined" ||
          board[y + offsetY][x + offsetX] ||
          x + offsetX < 0 ||
          y + offsetY >= ROWS ||
          x + offsetX >= COLS
        ) {
          if (offsetY === 1 && freezed) {
            lose = true // lose if the current shape is settled at the top most row
            //setOnPlay(false)
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
function tick() {
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
function drawBlock(x: number, y: number) {
  const ctx = canvasRef?.current?.getContext("2d")
  if (!ctx) return

  ctx.fillRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1)
  ctx.strokeRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1)
}

// draws the board and the moving shape
export function render() {
  const ctx = canvasRef?.current?.getContext("2d")
  if (!ctx) return

  ctx.clearRect(0, 0, WIDTH, HEIGHT)

  ctx.strokeStyle = "black"
  for (let x = 0; x < COLS; ++x) {
    for (let y = 0; y < ROWS; ++y) {
      if (board[y][x]) {
        ctx.fillStyle = COLORS[board[y][x] - 1]
        drawBlock(x, y)
      }
    }
  }

  ctx.fillStyle = "red"
  ctx.strokeStyle = "black"
  for (let y = 0; y < 4; ++y) {
    for (let x = 0; x < 4; ++x) {
      if (current[y][x]) {
        ctx.fillStyle = COLORS[current[y][x] - 1]
        drawBlock(currentX + x, currentY + y)
      }
    }
  }
}

// creates a new 4x4 shape in global letiable 'current'
// 4x4 so as to cover the size when the shape is rotated
function newShape() {
  console.log("newShapre")
  let id = Math.floor(Math.random() * SHAPES.length)
  let shape = SHAPES[id] // maintain id for color filling

  current = []
  for (let y = 0; y < 4; ++y) {
    current[y] = []
    for (let x = 0; x < 4; ++x) {
      let i = 4 * y + x
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
function init() {
  for (let y = 0; y < ROWS; ++y) {
    board[y] = []
    for (let x = 0; x < COLS; ++x) {
      board[y][x] = 0
    }
  }
}

function clearAllIntervals() {
  clearInterval(interval)
  clearInterval(intervalRender)
}

export function newGame(ref: RefObject<HTMLCanvasElement> | null) {
  canvasRef = ref
  clearAllIntervals()
  intervalRender = setInterval(render, 30)
  init()
  newShape()
  lose = false
  interval = setInterval(tick, 400)
  console.log("newGame end")
}

// returns rotates the rotated shape 'current' perpendicularly anticlockwise
function rotate(current: number[][]) {
  let newCurrent: number[][] = []
  for (let y = 0; y < 4; ++y) {
    newCurrent[y] = []
    for (let x = 0; x < 4; ++x) {
      newCurrent[y][x] = current[3 - x][y]
    }
  }

  return newCurrent
}

export function keyPress(key: string) {
  switch (key) {
    case "ArrowLeft":
      if (valid(-1)) {
        --currentX
      }
      break
    case "ArrowRight":
      if (valid(1)) {
        ++currentX
      }
      break
    case "ArrowDown":
      if (valid(0, 1)) {
        ++currentY
      }
      break
    case "ArrowUp":
      let rotated = rotate(current)
      if (valid(0, 0, rotated)) {
        current = rotated
      }
      break
    case " ":
      while (valid(0, 1)) {
        ++currentY
      }
      tick()
      break
  }
}
