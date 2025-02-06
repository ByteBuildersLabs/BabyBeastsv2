import axios from "axios";
import { useState, useRef, useEffect } from "react";
import MessageComponent, { Message } from "../ui/message";
import ThinkingDots from "../ui/thinking-dots";
import message from "../../assets/img/message.svg";
import "./main.css";

interface ApiError {
  message: string;
  status?: number;
}

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const MAX_MESSAGE_LENGTH = 500;

  const restoreFocus = () => {
    inputRef.current?.focus();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    restoreFocus();
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (input.trim() === "" || isLoading) return;
    setError(null);
    setIsLoading(true);
    const newMessage = { user: "Me", text: input };
    setMessages([...messages, newMessage]);
    setInput("");

    try {
      const response = await axios.post(import.meta.env.VITE_ELIZA_URL || "", {
        text: input,
      });

      if (response.data && response.data.length > 0) {
        const { user, text } = response.data[0];
        const botMessage = { user, text };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        throw new Error("Received empty response from server");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError({
        message: "Oops! Couldn't get a response. Please try again in a moment.",
        status: 500,
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          user: "System",
          text: "Failed to get response. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
      restoreFocus();
    }
  };

  return (
    <>
      <div className="chat">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <MessageComponent key={index} message={message} />
          ))}
          {isLoading && <ThinkingDots />}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask something to the master"
            value={input}
            disabled={isLoading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            maxLength={MAX_MESSAGE_LENGTH}
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={isLoading}
            className={`button ${isLoading ? "loading" : ""}`}
          >
            <img src={message} />
          </button>
        </div>
        {error && <div className="error-tooltip">{error.message}</div>}
      </div>
    </>
  );
}

export default Chat;
