import { memo } from "react";

export interface Message {
  user: string;
  text: string;
}

const MessageComponent = memo(({ message }: { message: Message }) => (
  <div className={`message ${message.user === "System" ? "error-message" : ""}`}>
    <span className="user">{message.user}:</span> {message.text}
  </div>
));

export default MessageComponent;
