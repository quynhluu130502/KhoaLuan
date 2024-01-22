import { Router, Request, Response, NextFunction } from "express";
import DetectedUnit from "../models/DetectedUnit";
import NCDetail from "../models/NCDetail";
import upload from "../configs/multerConfig";

const router = Router();

router.get("/detectedUnits", async (req: Request, res: Response) => {
  let detectedUnits = await DetectedUnit.find({}).select("-_id");
  res.json(detectedUnits);
});

router.post("/upload", upload.array("file", 6), async (req: Request, res: Response, next: NextFunction) => {
  const reqFiles: string[] = [];
  const url = req.protocol + "://" + req.get("host");
  if (req.files && Array.isArray(req.files)) {
    for (let i = 0; i < req.files.length; i++) {
      reqFiles.push(url + "/public/" + req.files[i].filename);
    }
  }
  res.json(reqFiles);

});

export default router;
