import { createContext, ReactNode, RefObject, useContext, useRef } from "react"

const GameContext = createContext<{
  canvasRef: RefObject<HTMLCanvasElement> | null
}>({ canvasRef: null })

const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  return (
    <GameContext.Provider value={{ canvasRef }}>
      {children}
    </GameContext.Provider>
  )
}

const useGameContext = () => useContext(GameContext)

export { GameProvider, useGameContext }
