import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001/chat");

export default function App() {
  const [joined, setJoined] = useState(false);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
  }, []);

  const joinRoom = () => {
    if (username && room) {
      socket.emit("joinRoom", { username, room });
      setJoined(true);
    }
  };

  const sendMessage = () => {
    socket.emit("sendMessage", msg);
    setMsg("");
  };

  if (!joined) {
    return (
      <div className="join">
        <h2>Join Chat</h2>
        <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
        <input placeholder="Room (room1 / room2)" onChange={e => setRoom(e.target.value)} />
        <button onClick={joinRoom}>Join</button>
      </div>
    );
  }

  return (
    <div className="chat">
      <h3>Room: {room}</h3>

      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={m.user === username ? "me" : "other"}>
            <b>{m.user}:</b> {m.text}
          </div>
        ))}
      </div>

      <div className="send">
        <input value={msg} onChange={e => setMsg(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
