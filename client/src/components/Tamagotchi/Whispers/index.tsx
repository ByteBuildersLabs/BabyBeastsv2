import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Beast } from "../../../dojo/bindings";
import message from "../../../assets/img/message.svg";
import MessageComponent, { Message } from "../../ui/message";
import initials from "../../../data/initials";
import "./main.css";

interface ApiError {
  message: string;
  status?: number;
}

const Whispers = ({ beast, expanded }: { beast: Beast; expanded: boolean }) => {
  // Whispers
  const [whispers, setWhispers] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [input, setInput] = useState("");
  // Chat
  const [messages, setMessages] = useState<Message[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const MAX_MESSAGE_LENGTH = 500;

  const restoreFocus = () => {
    inputRef.current?.focus();
  };

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
        setWhispers([botMessage]);
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

  const chat = (beast: Beast) => {
    return (
      <div className="whispers-chat">
        <div className="messages">
          {messages.map((message, index) => (
            <MessageComponent key={index} message={message} />
          ))}
        </div>
        <div className="chat-input">
          <input
            ref={inputRef}
            type="text"
            placeholder={`Talk to ${initials[beast.specie - 1].name}`}
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
        {error && <p>{error.message}</p>}
      </div>
    );
  };

  const uniMessage = () => {
    return (
      <div className="whispers">
        <div className="messages">
          {whispers.map((message, index) => (
            <MessageComponent key={index} message={message} />
          ))}
        </div>
        {error && <p>{error.message}</p>}
      </div>
    );
  };

  const analyzeStats = (beast: Beast) => {
    const range = {
      LOW: 30,
      MEDIUM: 50,
      HIGH: 80,
    };

    return Object.entries(beast)
      .map(([stat, value]) => ({
        stat,
        value,
        priority:
          value < range.LOW
            ? 3
            : value < range.MEDIUM
              ? 2
              : value > range.HIGH
                ? 1
                : 0,
      }))
      .sort((a, b) => b.priority - a.priority)[0];
  };

  const generatePrompt = (beast: Beast) => {
    const criticalStat = analyzeStats(beast);
    return `You are Pou, a virtual BabyBeast with the following statistics:
            Hunger: ${beast.hunger}/100
            Energy: ${beast.energy}/100
            Happiness: ${beast.happiness}/100
            Hygiene: ${beast.hygiene}/100
            
            Responds as a friendly and playful virtual pet, in 2 lines max.,
            focusing on your most urgent need: ${criticalStat.stat} (${criticalStat.value}/100);`;
  };

  const createWhisper = async (prompt: any) => {
    if (isLoading) return;
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(import.meta.env.VITE_ELIZA_URL || "", {
        text: prompt,
      });

      if (response.data && response.data.length > 0) {
        const { user, text } = response.data[0];
        const botWhisper = { user, text };
        setWhispers(() => [botWhisper]);
        setMessages((prevMessages) => [...prevMessages, botWhisper]);
      } else {
        throw new Error("Received empty response from server");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError({
        message: "Oops! Couldn't get a response. Please try again in a moment.",
        status: 500,
      });
      setWhispers((prevMessages) => [
        ...prevMessages,
        {
          user: "System",
          text: "Failed to get response. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const prompt = generatePrompt(beast);
    createWhisper(prompt);
    const intervalId = setInterval(() => {
      const prompt = generatePrompt(beast);
      createWhisper(prompt);
    }, 180000);

    return () => clearInterval(intervalId);
  }, []);

  return expanded ? chat(beast) : uniMessage();
};

export default Whispers;
