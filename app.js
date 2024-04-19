import express from "express";
import { config } from "dotenv";
import cors from "cors";
import fs from "fs";

import { router } from "./src/routes/yt.js";

config();

if (!fs.existsSync("./public")) {
  fs.mkdirSync("./public");
}

if (!fs.existsSync("./public/songs")) {
  fs.mkdirSync("./public/songs");
}

if (!fs.existsSync("./public/videos")) {
  fs.mkdirSync("./public/videos");
}

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public/songs"));
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,POST",
};

app.use(cors(corsOptions));

app.use("/yt", router);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
