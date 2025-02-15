import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import ChatSidebar from "../components/Chat/ChatSidebar";
import ChatWindow from "../components/Chat/ChatWindow";
import { logout } from "../services/api";

const SOCKET_URL = "https://chat-app-backend-g2ug.onrender.com"; 

const ChatPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem("user");
    console.log(userData);
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    } else {
      navigate("/"); // Redirect if not logged in
    }
  }, [navigate]);

  // Establish WebSocket connection
  useEffect(() => {
    if (currentUser && !socket) {
      const socketInstance = io(SOCKET_URL, { transports: ["websocket"] });
  
      socketInstance.on("connect", () => {
        console.log("Connected to WebSocket");
        socketInstance.emit("user-online", currentUser.username); // Notify server
      });
  
      socketInstance.on("update-users", (onlineUsers) => {
        setOnlineUsers(onlineUsers); // Store active users
      });
  
      setSocket(socketInstance);
  
      return () => {
        socketInstance.emit("user-offline", currentUser.username); // Notify server on logout
        socketInstance.disconnect();
      };
    }
  }, [currentUser]); 

  // Logout function
  const handleLogout = () => {
    logout();
    localStorage.removeItem("user"); 
    navigate("/");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white flex justify-between items-center p-4">
        <div className="flex items-center space-x-2">
          <img src="/logo.svg" alt="Chat App Logo" className="w-8 h-8" />
          <h1 className="text-xl font-semibold">Chat App</h1>
        </div>
        {currentUser && (
          <div className="flex items-center space-x-4">
            <span className="text-lg">{currentUser.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Chat Layout */}
      <div className="flex flex-grow">
        {currentUser ? (
          <>
            <ChatSidebar
              currentUsername={currentUser.username}
              setSelectedUser={setSelectedUser}
            />
            <div className="flex-grow">
              {selectedUser ? (
                <ChatWindow
                  currentUsername={currentUser.username}
                  selectedUser={selectedUser}
                  socket={socket}
                />
              ) : (
                <p className="text-center mt-10">Select a user to start chatting</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-center mt-10">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
