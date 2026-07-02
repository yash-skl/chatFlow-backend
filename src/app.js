import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { JSON_LIMIT } from './constants.js';


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));


app.use(express.json({limit: JSON_LIMIT})) 
app.use(express.urlencoded({extended: true, limit:JSON_LIMIT}))
app.use(express.static("public"))
app.use(cookieParser())


import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/messages", messageRoutes);

export { app}