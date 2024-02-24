import { Router, Request, Response, NextFunction } from "express";
import NCDetail from "../models/NCDetail";
import User from "../models/User";
import upload from "../configs/multerConfig";
import masterData from "../data/masterData.json";
import { JwtPayload, verify } from "jsonwebtoken";

enum Stage {
  Created = 0,
  Accepted = 1,
  InProgress = 2,
  Closed = 3,
}

const router = Router();

router.get("/masterData", async (req: Request, res: Response) => {
  res.json(masterData);
});

router.get("/internalUsers", async (req: Request, res: Response) => {
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

router.post("/create", async (req: Request, res: Response) => {
  const authorizationHeader = req.headers.authorization;
  let token = "";
  if (authorizationHeader) {
    token = authorizationHeader.split(" ")[1];
    const data: JwtPayload = verify(token, process.env.TOKEN_SECRET!) as JwtPayload;
    if (!data) {
      res.status(401).send("Invalid token");
      return;
    }
    req.body.creator = data.sso;
  } else {
    res.status(401).send("Authorization header missing");
    return;
  }
  const ncDetail = new NCDetail(req.body);
  ncDetail.stage = Stage.Created;
  await ncDetail
    .save()
    .then((result) => {
      res.json({ result: result, message: "NC Detail created successfully!" });
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

router.post("/clone", async (req: Request, res: Response) => {
  const ncDetail = new NCDetail(req.body);
  await ncDetail
    .save()
    .then((result) => {
      res.json({ result: result, message: "NC Detail cloned successfully!" });
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

router.get("/list", async (req: Request, res: Response) => {
  const ncDetails = await NCDetail.find({});
  res.json(ncDetails);
});

router.get("/get/:id", async (req: Request, res: Response) => {
  await NCDetail.findOne({ id: req.params.id })
    .then((result) => {
      if (result != null) {
        return res.json({ result: result, message: "NC Detail found!" });
      } else {
        return res.json({ message: "NC Detail not found!" });
      }
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

router.put("", async (req: Request, res: Response) => {
  req.body.stage = Stage.InProgress;
  req.body.acceptedDate = new Date();
  await NCDetail.findOneAndUpdate({ id: req.body.id }, req.body)
    .then((result) => {
      if (result) {
        res.json({ result: result, message: "NC Detail updated successfully!" });
      } else {
        res.json({ message: "NC Detail not found!" });
      }
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

router.delete("/:id", async (req: Request, res: Response) => {
  await NCDetail.findOneAndDelete({ id: req.params.id })
    .then((result) => {
      if (result) {
        res.json({ result: result, message: "NC Detail deleted successfully!" });
      } else {
        res.json({ message: "NC Detail not found!" });
      }
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

router.get("/myNCs", async (req: Request, res: Response) => {
  const authorizationHeader = req.headers.authorization;
  let token = "";
  if (authorizationHeader) {
    token = authorizationHeader.split(" ")[1];
    const data: JwtPayload = verify(token, process.env.TOKEN_SECRET!) as JwtPayload;
    if (!data) {
      res.status(401).send("Invalid token");
      return;
    }
    const ncDetails = await NCDetail.find({ creator: data.sso });
    res.json(ncDetails);
  } else {
    res.status(401).send("Authorization header missing");
    return;
  }
});

router.get("/getNameBySSO/:sso", async (req: Request, res: Response) => {
  const user = await User.findOne({ sso: req.params.sso });
  if (user) {
    res.json({ result: user.name });
  } else {
    res.json({ message: "User not found" });
  }
});

export default router;
