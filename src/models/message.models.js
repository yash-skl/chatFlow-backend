import mongoose,{Schema} from "mongoose";


const messageSchema = new Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        delivered: {
            type: Boolean,
            default: false
        },
        
        read: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

export const Message = mongoose.model("Message", messageSchema);