import { Router, Request, Response } from "express";
import detectedUnit from "../models/detectedUnit";

const router = Router();

router.get("/detectedUnits", async (req: Request, res: Response) => {
  let detectedUnits = await detectedUnit.find({}).select("-_id");
  res.json(detectedUnits);
});

export default router;