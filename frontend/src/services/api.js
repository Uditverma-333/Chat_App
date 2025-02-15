import axios from 'axios';

const API_URL = 'http://localhost:1337/api';

// Authentication
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/local`, { identifier: email, password });
    return response.data; 
  } catch (error) {
    console.error('Login failed:', error);
    throw error; 
  }
};

export const signup = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/local/register`, {
      username,
      email,
      password,
    });
    return response.data; 
  } catch (error) {
    console.error('Signup failed:', error);
    throw error; 
  }
};

export const logout = () => {
  localStorage.removeItem('jwt'); 
  sessionStorage.removeItem('jwt'); 
};

// Chats
export const fetchChats = async (userId) => {
  try {
    console.log(`🔍 Fetching chats for userId: ${userId}`);

    const response = await axios.get(`${API_URL}/chats`, {
      params: {
        "filters[participants][id][$eq]": userId,
        "populate": "participants", 
      },
    });

    console.log("Chat API Response:", response.data);
    return response;  
  } catch (error) {
    console.error("Error fetching chats:", error.response?.data || error.message);
    throw error; 
  }
};

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; 
  }
};


export const fetchMessages = async (chatId) => {
  return axios.get(`${API_URL}/messages`, {
    params: {
      filters: { chat: chatId },
      populate: "sender",
      sort: ["createdAt:asc"],
    },
  });
};

export const sendMessage = async ({ text, senderId, chatId }) => {
  return axios.post(`${API_URL}/messages`, {
    data: { text, sender: senderId, chat: chatId },
  });
};

export const createChat = async ({ user1, user2 }) => {
  const payload = {
    data: {
      participants: [user1, user2],
    },
  };

  console.log("Creating chat with payload:", payload);

  try {
    const response = await axios.post(`${API_URL}/chats`, payload);
    console.log("Chat created successfully:", response.data);
    return response;
  } catch (error) {
    console.error("Error creating chat:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchUserId = async (username) => {
  console.log("Fetching user ID for:", username);

  try {
    const response = await axios.get(
      `http://localhost:1337/api/users?filters[username][$eq]=${username}`
    );

    console.log("✅ API Response:", response.data); 
    if (response.data && response.data.length > 0) {
      console.log("🎯 User ID found:", response.data[0].id);
      return response.data[0]; 
    } else {
      console.warn("No user found for username:", username);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user ID:", error.message);
    return null;
  }
};

