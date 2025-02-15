import { useEffect, useState } from "react";
import MessageInput from "./MessageInput";
import { fetchChats, fetchMessages, sendMessage, createChat, fetchUserId } from "../../services/api";

const ChatWindow = ({ currentUsername, selectedUser, socket }) => {
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchUserIdsAndChat = async () => {
      if (!selectedUser || !currentUsername) return;
      setLoading(true);

      try {
        console.log("🔍 Fetching user IDs...");
        const currentUserResponse = await fetchUserId(currentUsername);
        const selectedUserResponse = await fetchUserId(selectedUser);

        if (!currentUserResponse || !selectedUserResponse) {
          console.warn("Unable to fetch user IDs");
          setLoading(false);
          return;
        }

        const currentUserId = currentUserResponse.id;
        const selectedUserId = selectedUserResponse.id;
        setCurrentUserId(currentUserId);
        setSelectedUserId(selectedUserId);
        console.log("User IDs:", { currentUserId, selectedUserId });

        console.log("Fetching existing chats...");
        const response = await fetchChats(currentUserId);
        console.log("Chat API Response:", response.data);

        let chatData = response.data.data.find((chat) =>
          chat.participants.some((p) => p.id === selectedUserId)
        );

        if (!chatData) {
          console.warn("No chat found. Creating a new one...");
          const newChatResponse = await createChat({
            user1: currentUserId,
            user2: selectedUserId,
          });

          if (!newChatResponse || !newChatResponse.data.data) {
            throw new Error("Failed to create chat");
          }

          chatData = newChatResponse.data.data;
          console.log("New chat created:", chatData);
        }

        setChatId(chatData.id);

        console.log("Fetching messages for chat ID:", chatData.id);
        const messagesResponse = await fetchMessages(chatData.id);
        console.log("Messages API Response:", messagesResponse.data);
        setMessages(messagesResponse.data.data);
      } catch (error) {
        console.error("Chat error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserIdsAndChat();
  }, [selectedUser, currentUsername]);

  useEffect(() => {
    if (!socket || !currentUserId || !selectedUserId) return;

    const handleNewMessage = (message) => {
      console.log("Received new message via WebSocket:", message);
      if (
        (message.receiverId === currentUserId && message.senderId === selectedUserId) ||
        (message.receiverId === selectedUserId && message.senderId === currentUserId)
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    socket.on("message", handleNewMessage);
    return () => socket.off("message", handleNewMessage);
  }, [socket, currentUserId, selectedUserId]);

  const handleSendMessage = async (text) => {
    if (!socket || !selectedUserId || !chatId) {
      console.warn("Cannot send message. Missing parameters:", { socket, selectedUserId, chatId });
      return;
    }

    const newMessage = { text, senderId: currentUserId, receiverId: selectedUserId, chatId };

    console.log("Sending message:", newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    socket.emit("message", newMessage);

    try {
      console.log("Saving message to database...");
      const response = await sendMessage(newMessage);
      console.log("Message saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  return (
    <div className="flex-1 p-4 bg-white shadow-lg">
      <h2 className="font-bold text-lg">
        {selectedUser ? `Chat with ${selectedUser}` : "Select a user to chat"}
      </h2>
      <div className="h-[70vh] max-h-[70vh] border p-4 overflow-y-auto">
  {loading ? (
    <p className="text-gray-500">Loading chat...</p>
  ) : messages.length > 0 ? (
    messages.map((message, index) => {
      console.log("📩 Rendering message:", message); // Debugging log
  
      // Ensure senderId exists, otherwise fallback to prevent UI issues
      const isSentByCurrentUser = 
        message.senderId === currentUserId || 
        message.sender?.id === currentUserId;

      return (
        <div
          key={index}
          className={`p-2 my-1 rounded max-w-xs ${
            isSentByCurrentUser
              ? "bg-blue-500 text-white ml-auto" 
              : "bg-gray-300 text-black mr-auto" 
          }`}
        >
          <p>{message.text}</p>
        </div>
      );
    })
  ) : (
    <p className="text-gray-500">No messages yet</p>
  )}
</div>
      <MessageInput sendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatWindow;
