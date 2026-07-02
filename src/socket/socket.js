import { Server } from "socket.io";
import { Message } from "../models/message.models.js";

const onlineUsers = new Map();

let io;

const setupSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("User connected", socket.id);

        socket.on("join", (userId) => {
            onlineUsers.set(userId, socket.id);
            io.emit("onlineUsers", [...onlineUsers.keys()]);
        });

        socket.on("typing", ({ senderId, receiverId }) => {
            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("typing", { senderId });
            }
        });

        socket.on("stopTyping", ({ senderId, receiverId }) => {
            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("stopTyping", { senderId });
            }
        });

        socket.on("messageDelivered", async ({ messageId, senderId }) => {
            if (!messageId || !senderId) return;

            await Message.findByIdAndUpdate(messageId, { delivered: true });

            const senderSocketId = getReceiverSocketId(senderId);
            if (senderSocketId) {
                io.to(senderSocketId).emit("messageDelivered", { messageId });
            }
        });

        socket.on("messageRead", async ({ senderId, receiverId }) => {
            if (!senderId || !receiverId) return;

            await Message.updateMany(
                { senderId, receiverId, read: false },
                { read: true, delivered: true }
            );

            const senderSocketId = getReceiverSocketId(senderId);
            if (senderSocketId) {
                io.to(senderSocketId).emit("messageRead", { readerId: receiverId });
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected", socket.id);

            let disconnectedUserId = null;
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    disconnectedUserId = userId;
                    onlineUsers.delete(userId);
                    break;
                }
            }
            if (disconnectedUserId) {
                io.emit("onlineUsers", [...onlineUsers.keys()]);
            }
        });
    });

    return io;
};

const getReceiverSocketId = (userId) => {
    return onlineUsers.get(userId);
};

const getIO = () => io;

export { setupSocket, getReceiverSocketId, getIO };
