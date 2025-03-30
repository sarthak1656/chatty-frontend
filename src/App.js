  import "./App.css";
  import { useState, useEffect } from "react";
  import io from "socket.io-client";
  import { nanoid } from "nanoid";

  const socket = io.connect("https://chatty-backend-9pvt.onrender.com");
  const username = nanoid(4);

  function App() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);

    const sendChat = (e) => {
      e.preventDefault();
      socket.emit("chat", { message, username });
      setMessage("");
    };

    useEffect(() => {
      socket.on("chat", (payload) => {
        setChat((prevChat) => [...prevChat, payload]);
      });

      return () => {
        socket.off("chat"); // Clean up the event listener to avoid memory leaks
      };
    }, []);

    return (
      <div className="App">
        <header className="App-header">
          <h1>Chatty app</h1>

          {chat.map((payload, index) => {
            return (
              <p key={index}>
                {payload.message} <span>id: {payload.username}</span>{" "}
              </p>
            );
          })}

          <form onSubmit={sendChat}>
            <input
              type="text"
              name="chat"
              placeholder="send message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <button type="submit">send</button>
          </form>
        </header>
      </div>
    );
  }

  export default App;
