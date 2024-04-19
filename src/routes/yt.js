import { Router } from "express";
import { downloadHandler } from "../controllers/yt/yt.js";

export const router = Router();

router.post("/download", downloadHandler);
