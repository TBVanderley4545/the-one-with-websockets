import parser from "body-parser";
import cors from "cors";
import express from "express";
import { defaultRouter } from "./src/routes/default";
import { testRouter } from "./src/routes/test";
import { initializeServer } from "./src/sockets";

const PORT = 3001;
const app = express();

app.use(parser.json(), cors());
app.use("/", defaultRouter);
app.use("/test", testRouter);

export const wsServer = initializeServer(app, PORT);
