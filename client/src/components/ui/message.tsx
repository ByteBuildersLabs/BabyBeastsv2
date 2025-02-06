import { memo } from "react";

export interface Message {
  user: string;
  text: string;
}

const MessageComponent = memo(({ message }: { message: Message }) => (
  <div
    className={`message ${message.user === "System" ? "error-message" : `${message.user}`}`}
  >
    <span className="user">{message.user}</span>
    <p>{message.text}</p>
  </div>
));

export default MessageComponent;
