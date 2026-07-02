import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Message } from "../models/message.models.js";
import { getIO, getReceiverSocketId } from "../socket/socket.js";

const sendMessage = asyncHandler(async (req, res) => {
    const {senderId, receiverId, content} = req.body;
    if (!senderId || !receiverId || !content?.trim()) {
        throw new ApiError(400, "Sender, receiver and content are required");
    }
    const message = await Message.create({senderId, receiverId, content:content.trim()});

    const populatedMessage = await Message.findById(message._id).populate("senderId", "username").populate("receiverId", "username");
    if (!populatedMessage) {
        throw new ApiError(500, "Failed to fetch created message");
    }
    const io = getIO();
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", populatedMessage);
    }

    return res.status(201).json(new ApiResponse(201, populatedMessage, "Message sent successfully"));
})


const getMessages = asyncHandler(async (req, res) => {

    const {currentUserId, receiverId} = req.query;
    if(!currentUserId || !receiverId){
        throw new ApiError(400, "Current user id and receiver id are required");
    }
    const messages = await Message.find({
        $or: [
            {senderId: currentUserId, receiverId: receiverId},
            {senderId: receiverId, receiverId: currentUserId}
        ]
    }).populate("senderId", "username")
    .populate("receiverId", "username")
    .sort({createdAt: 1});
    return res.status(200).json(new ApiResponse(200, messages, "Messages fetched successfully"));
})

export { sendMessage, getMessages };