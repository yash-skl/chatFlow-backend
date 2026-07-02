import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
})

export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log(`MongoDB connected to ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}