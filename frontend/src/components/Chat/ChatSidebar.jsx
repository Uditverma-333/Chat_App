import { useEffect, useState } from "react";
import { fetchUsers } from "../../services/api";
import { FaUserCircle } from "react-icons/fa";

const ChatSidebar = ({ currentUsername, setSelectedUser, socket }) => {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]); // Track online users
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("update-users", (activeUsers) => {
        setOnlineUsers(activeUsers);
      });
    }
  }, [socket]);

  const handleUserClick = (username) => {
    setSelectedUser(username);
    setActiveUser(username);
  };

  return (
    <div className="w-1/4 bg-gray-100 shadow-lg p-4 h-full overflow-y-auto">
      <h2 className="font-bold text-lg mb-2">Users</h2>
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-2 border border-gray-300 rounded"
      />
      {loading ? (
        <div className="text-gray-500">Loading users...</div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul>
          {users
            .filter(
              (user) =>
                user.username !== currentUsername &&
                user.username.toLowerCase().includes(search.toLowerCase())
            )
            .map((user) => (
              <li
                key={user.id}
                className={`p-2 cursor-pointer rounded flex items-center gap-3 transition ${
                  activeUser === user.username
                    ? "bg-blue-500 text-white font-semibold shadow-md"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => handleUserClick(user.username)}
              >
                <FaUserCircle className="text-2xl text-gray-600" />
                <span>{user.username}</span>

                {/* Online status indicator */}
                {onlineUsers.includes(user.username) && (
                  <span className="w-3 h-3 bg-green-500 rounded-full ml-auto"></span>
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default ChatSidebar;
