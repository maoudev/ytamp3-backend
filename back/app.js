import express from "express";
import { config } from "dotenv";
import cors from "cors";

import { handler as ssrHandler } from "../front/dist/server/entry.mjs";
import { router } from "./src/routes/yt.js";

config();

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());

const corsOptions = {
  origin: "https://ytamp3.com",
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
