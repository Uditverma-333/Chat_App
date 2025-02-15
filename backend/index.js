const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config(); // Load env variables

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", credentials: true },
});

const PORT = process.env.WS_PORT || 8080;
const STRAPI_API_URL = process.env.STRAPI_API_URL || "http://localhost:1337/api";
const userSockets = new Map(); // Efficient user-to-socket mapping

app.use(cors());
app.use(express.json());

server.listen(PORT, () => {
  console.log(`🚀 Server running on ws://localhost:${PORT}`);
});

io.on("connection", (socket) => {
  console.log("✅ New client connected:", socket.id);

  // 📌 User joins the chat
  socket.on("join", async (userId) => {
    userSockets.set(userId, socket.id);
    console.log(`👤 User ${userId} connected as ${socket.id}`);

    // Notify others that this user is online
    io.emit("userOnline", userId);
  });

  // 📩 Handle sending messages
  socket.on("message", async ({ text, senderId, chatId }) => {
    console.log(`📩 Message from ${senderId} in chat ${chatId}: ${text}`);

    try {
      // 🔹 Save message to Strapi
      const messageResponse = await axios.post(`${STRAPI_API_URL}/messages`, {
        data: {
          text,
          sender: senderId,
          chat: chatId, // Associate message with the chat
        },
      });

      const savedMessage = messageResponse.data.data;
      console.log("💾 Message saved!", savedMessage);

      // 🔹 Broadcast the message to the specific chat room
      io.to(chatId).emit("message", savedMessage);

    } catch (err) {
      console.error("❌ Error saving message:", err.response?.data || err.message);
    }
  });

  // 📜 Fetch previous messages when user joins a chat
  socket.on("fetchMessages", async (chatId, callback) => {
    try {
      const response = await axios.get(`${STRAPI_API_URL}/messages`, {
        params: {
          filters: { chat: chatId },
          populate: "sender",
          sort: ["createdAt:asc"], // Oldest to newest
        },
      });

      callback(response.data.data); // Send messages back to client
    } catch (err) {
      console.error("❌ Error fetching messages:", err.response?.data || err.message);
    }
  });

  // 🟢 User joins a chat room
  socket.on("joinRoom", (chatId) => {
    socket.join(chatId);
    console.log(`📂 User joined chat room: ${chatId}`);
  });

  // 🔴 User leaves a chat room
  socket.on("leaveRoom", (chatId) => {
    socket.leave(chatId);
    console.log(`🚪 User left chat room: ${chatId}`);
  });

  // 🚪 Handle user disconnection
  socket.on("disconnect", () => {
    let disconnectedUser = null;

    for (let [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        disconnectedUser = userId;
        userSockets.delete(userId);
        break;
      }
    }

    if (disconnectedUser) {
      console.log(`❌ User ${disconnectedUser} disconnected`);

      // Notify others that this user is offline
      io.emit("userOffline", disconnectedUser);
    }
  });
});
