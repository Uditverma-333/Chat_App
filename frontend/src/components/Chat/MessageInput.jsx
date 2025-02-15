import { useState } from "react";

const MessageInput = ({ sendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage(message.trim());
    setMessage(""); // Clear input after sending
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center p-2 border-t bg-gray-50">
      <input
        type="text"
        className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button
        onClick={handleSend}
        className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
