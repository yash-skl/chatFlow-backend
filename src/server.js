import { app } from "./app.js";
import { connectDB } from "./db/index.js";
import { setupSocket } from "./socket/socket.js";
import dotenv from "dotenv";
import http from "http";
dotenv.config({
    path: "./.env"
})

const server = http.createServer(app);

connectDB().then(() => {
    setupSocket(server);
    server.listen(process.env.PORT, () => {        console.log(`Server is running on port ${process.env.PORT}`)
    });
  })
  .catch((err) => {
    console.log(err);
  });

export { server };