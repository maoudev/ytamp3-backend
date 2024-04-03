import { Router } from "express";
import { downloadHandler, getSong } from "../controllers/yt/yt.js";

export const router = Router();

router.post("/download", downloadHandler);
router.get("/song/:fileName", getSong);
