const io = require("socket.io-client");

const socket = io("ws://localhost:8080");

socket.on("connect", () => {
    console.log("✅ Connected to the server!");

    // Register the sender and receiver
    socket.emit("register", 1);  // Register senderId as 1
    socket.emit("register", 2);  // Register receiverId as 2

    // Send a test message from senderId: 1 to receiverId: 2
    const messageData = {
        text: "Hello from client!", 
        senderId: 1,  // Sender's user ID
        receiverId: 2 // Receiver's user ID
    };
    
    socket.emit("message", messageData);
    console.log("📩 Sent message:", messageData);
});

// Handle incoming messages from the server
socket.on("message", (data) => {
    console.log("📩 Received:", data);
});

// Handle disconnection
socket.on("disconnect", () => {
    console.log("❌ Disconnected from the server");
});