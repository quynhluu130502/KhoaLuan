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
    let user = await User.findOneAndUpdate({ sso: sso }, { application: application }).select("-pass -salt -_id");
    if (user) {
      res.json({ result: user, message: "Applications added successfully" });
    } else {
      res.json({ error: "User not found" });
    }
  } catch (err) {
    res.json({ error: "User not found" });
  }
});

const getInternalUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({
      application: {
        $exists: true,
        $ne: [],
      },
    }).select("-pass -salt");
    res.json({ result: users, message: "Internal users found" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
router.get("/internalUsers", getInternalUsers);

const isInternalUser = async (req: Request, res: Response) => {
  try {
    const sso = req.body.sso;
    const user = await User.findOne({ sso: sso });
    if (user) {
      if (user.application.length == 0) {
        res.json({ result: user, message: "User is not an internal user" });
        return;
      }
      res.json({ message: "User is an internal user" });
      return;
    }
    res.json({ message: "User not found" });
    return;
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
router.post("/isInternalUser", isInternalUser);

const removeInternalUser = async (req: Request, res: Response) => {
  try {
    const sso = req.body.sso;
    const user = await User.findOneAndUpdate({ sso: sso }, { application: [] });
    if (user) {
      res.json({ result: "Success", message: "User removed from application" });
    } else {
      res.json({ message: "User not found" });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
router.patch("/removeInternalUser", removeInternalUser);

export default router;
