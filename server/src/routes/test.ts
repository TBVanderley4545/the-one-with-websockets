import { Router } from "express";
import { wsServer } from "../../index";
import { seedValue } from "../seedValue";

const testRouter = Router();

testRouter.post("/", (req, res) => {
  const { newValue } = req.body;
  seedValue.count = newValue;

  wsServer.emit("progress", seedValue.count);

  res.status(200).send();
});

export { testRouter };
