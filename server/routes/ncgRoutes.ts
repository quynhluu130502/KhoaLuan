import { Router, Request, Response, NextFunction } from "express";
import NCDetail from "../models/NCDetail";
import User from "../models/User";
import upload from "../configs/multerConfig";
import masterData from "../data/masterData.json"

const router = Router();

router.get('/masterData', async (req: Request, res: Response) => {
  res.json(masterData);
});

router.get('/internalUsers', async (req: Request, res: Response) => {
  const users = await User.find({}).select("-pass -salt");
  res.json(users);
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
