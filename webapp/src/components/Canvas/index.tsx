import "./style.css"

const Canvas: React.FC<{ canvasRef: React.LegacyRef<HTMLCanvasElement> }> = ({
  canvasRef,
}) => <canvas ref={canvasRef} width="300" height="600" />

export default Canvas
