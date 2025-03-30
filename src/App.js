import "./App.css";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import { nanoid } from "nanoid";

const socket = io.connect("https://chatty-backend-9pvt.onrender.com");
const username = nanoid(4);

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const installApp = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
      });
    }
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chat", { message, username });
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("chat", (payload) => {
      setChat((prevChat) => [...prevChat, payload]);
    });

    return () => {
      socket.off("chat");
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chatty</h1>
        <button onClick={installApp}>Install Chatty</button>

        {chat.map((payload, index) => (
          <p key={index}>
            <strong>{payload.username}:</strong> {payload.message}
          </p>
        ))}

        <form onSubmit={sendChat}>
          <input
            type="text"
            name="chat"
            placeholder="Send a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </header>
    </div>
  );
}

export default App;
