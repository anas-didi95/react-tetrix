import "./style.css"

const PlayButton: React.FC<{ onPlay: boolean; handlePlay: () => void }> = ({
  onPlay,
  handlePlay,
}) => (
  <button id="playbutton" disabled={onPlay} onClick={handlePlay}>
    Play
  </button>
)

export default PlayButton
