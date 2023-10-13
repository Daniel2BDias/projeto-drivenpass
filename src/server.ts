import express, { Express, json } from "express";
import "express-async-errors";
import cors from "cors";
import dotenv from "dotenv";
import { handleApplicationErrors } from "./middlewares/errorHandling.middleware";
import { userRouter } from "./routes/user.routes";
import { credentialsRouter } from "./routes/credentials.routes";
import { connectDb, disconnectDB } from "./database";

dotenv.config();

export const server: Express = express();

server.use(json());
server.use(cors());
server.use(userRouter);
server.use("/credentials", credentialsRouter);
server.use(handleApplicationErrors);

export function init(): Promise<Express> {
    connectDb();
    return Promise.resolve(server);
}
  
export async function close(): Promise<void> {
    await disconnectDB();
}

const PORT = process.env.PORT || 5000;

init().then(() => {
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}.`);
    });
  });
