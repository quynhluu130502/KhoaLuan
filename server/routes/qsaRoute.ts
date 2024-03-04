import { Router, Request, Response, NextFunction } from "express";
import applicationName from "../data/applicationName.json";
import ncRole from "../data/Non Conformities/role.json";
import ncSubBusiness from "../data/Non Conformities/sub-business.json";
import fs from "fs";
import path from "path";
import User from "../models/user";

const getUnitFiles = (dir: string) => {
  const absoluteDir = path.resolve(__dirname, dir);
  const files = fs.readdirSync(absoluteDir);
  return files;
};

const router = Router();
const unitFiles = getUnitFiles("../data/Non Conformities/Unit");

router.get("/applicationName", async (req: Request, res: Response) => {
  res.json(applicationName);
});

router.get("/nc/role", async (req: Request, res: Response) => {
  res.json(ncRole);
});

router.get("/nc/sub-business", async (req: Request, res: Response) => {
  res.json(ncSubBusiness);
});

router.get("/nc/unit/:unit", async (req: Request, res: Response) => {
  const unit = req.params.unit.toLowerCase();
  const unitFile = unitFiles.find((file) => {
    return file.toLowerCase() === `${unit}.json`;
  });
  if (unitFile) {
    const unitData = fs.readFileSync(path.resolve(__dirname, `../data/Non Conformities/Unit/${unitFile}`), "utf-8");
    res.json(JSON.parse(unitData));
  } else {
    res.json({ error: "Unit not found" });
  }
});

router.patch("/addApps", async (req: Request, res: Response) => {
  const application = req.body.application;
  const sso = req.body.sso;
  try {
    let user = await User.findOneAndUpdate({ sso: sso }, { application: application });
    if (user) {
      res.json({ message: "Applications added successfully" });
    } else {
      res.json({ error: "User not found" });
    }
  } catch (err) {
    res.json({ error: "User not found" });
  }
});

export default router;
