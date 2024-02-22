import express from "express";
import { config } from "dotenv";
import cors from "cors";
import fs from "fs";

import { handler as ssrHandler } from "../front/dist/server/entry.mjs";
import { router } from "./src/routes/yt.js";

config();

if (!fs.existsSync("./public/songs")) {
  fs.mkdirSync("./public/songs");
}

if (!fs.existsSync("./public/videos")) {
  fs.mkdirSync("./public/videos");
  x;
}

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());
app.use(express.static("public/songs"));
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/", express.static("../front/dist/client"));
app.use(ssrHandler);

app.use("/yt", router);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
