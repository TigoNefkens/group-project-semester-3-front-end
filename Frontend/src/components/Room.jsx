import "./Room.css"

export default function Room({ room, Submit }) {
  return (
    <button className="Room-box" onClick={Submit}>
      {room.name}
    </button>
  );
}