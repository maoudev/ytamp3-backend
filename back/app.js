import express from "express";
import { config } from "dotenv";
import { handler as ssrHandler } from "../front/dist/server/entry.mjs";
import { router } from "./src/routes/yt.js";

config();

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());

app.use("/", express.static("../front/dist/client"));
app.use(ssrHandler);
app.use("/yt", router);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
