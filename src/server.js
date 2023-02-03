import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import { pgConnect, syncModels } from "./db.js";
import productRouter from "./api/products/index.js";
import categoryRouter from "./api/categories/index.js";
import userRouter from "./api/users/index.js";
import reviewsRouter from "./api/reviews/index.js";
import cardItemRouter from "./api/cards/index.js";
import {
  unauthorizedErrorHandler,
  badRequestErrorHandler,
  forbiddenErrorHandler,
  notFoundErrorHandler,
  genericErrorHandler,
} from "./errorHandler.js";
const server = express();
const port = process.env.PORT || 3001;

server.use(cors());
server.use(express.json());
server.use("/products", productRouter);
server.use("/categories", categoryRouter);
server.use("/users", userRouter);
server.use("/reviews", reviewsRouter);
server.use("/cardItems", cardItemRouter);
server.use(badRequestErrorHandler);

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
