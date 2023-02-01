import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import { pgConnect, syncModels } from "./db.js";
import cardRouter from "./api/card/index.js";
import {
  unauthorizedErrorHandler,
  forbiddenErrorHandler,
  notFoundErrorHandler,
  genericErrorHandler,
} from "./errorHandler.js";
const server = express();
const port = process.env.PORT || 3001;

server.use(cors());
server.use(express.json());
server.use("/cards", cardRouter);
server.use(unauthorizedErrorHandler);
server.use(forbiddenErrorHandler);
server.use(notFoundErrorHandler);
server.use(genericErrorHandler);
await pgConnect();
await syncModels();
server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on port ${port}`);
});
