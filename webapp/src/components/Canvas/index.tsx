import { WIDTH, HEIGHT } from "../../utils/contants"
import "./style.css"

const Canvas: React.FC<{ canvasRef: React.LegacyRef<HTMLCanvasElement> }> = ({
  canvasRef,
}) => <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />

export default Canvas
