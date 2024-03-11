import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import excel from "exceljs";
import { sendMailToValidator } from "../configs/sendMail";
import masterData from "../data/masterData.json";
import userController from "./userController";
import NCDetail from "../models/NCDetail";
import User from "../models/user";

enum Stage {
  Created = 0,
  Accepted = 1,
  Solved = 2,
  Closed = 3,
  Cancelled = -1,
}

const StageString = {
  "0": "Created",
  "1": "Accepted",
  "2": "Solved",
  "3": "Closed",
  "-1": "Cancelled",
};

const getMasterData = async (req: Request, res: Response) => {
  res.json(masterData);
};

const getInternalUers = async (req: Request, res: Response) => {
  const users = await User.find({}).select("-pass -salt");
  res.json(users);
};

const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  const reqFiles: string[] = [];
  const url = req.protocol + "://" + req.get("host");
  if (req.files && Array.isArray(req.files)) {
    for (let i = 0; i < req.files.length; i++) {
      reqFiles.push(url + "/public/" + req.files[i].filename);
    }
  }
  res.json(reqFiles);
};

const getAllNCs = async (req: Request, res: Response) => {
  const ncDetails = await NCDetail.find({});
  res.json(ncDetails);
};

const getOneNC = async (req: Request, res: Response) => {
  await NCDetail.findOne({ id: req.params.id })
    .then((result) => {
      if (result != null) {
        return res.json({ result: result, message: "NC Detail found!" });
      } else {
        return res.json({ message: "This NC cannot be found!" });
      }
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

const createNC = async (req: Request, res: Response) => {
  req.body.creator = req.body.user.sso;
  const ncDetail = new NCDetail(req.body);
  ncDetail.stage = Stage.Created;
  await ncDetail
    .save()
    .then(async (result: any) => {
      const noti = createMessage(req.body.user.name, "have assigned you to", result.id);
      await userController.createNotification(result.validator, noti);
      await sendMailToValidator(result);
      res.json({ result: result, message: "NC Detail created successfully!" });
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

const saveNC = async (req: Request, res: Response) => {
  const noti = createMessage(req.body.user.name, "had saved action on", req.body.id);
  await userController.createNotification(req.body.user.sso, noti);
  await NCDetail.findOneAndUpdate({ id: req.body.id }, req.body)
    .then((result) => {
      if (result) {
        res.json({ result: result, message: "NC Detail saved successfully!" });
      } else {
        res.json({ message: "This NC cannot be found!" });
      }
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

const cancelNC = async (req: Request, res: Response) => {
  const noti = createMessage(req.body.user.name, "had cancelled action on", req.body.id);
  await userController.createNotification(req.body.user.sso, noti);
  req.body.stage = Stage.Cancelled;
  req.body.cancelledDate = new Date();
  await NCDetail.findOneAndUpdate({ id: req.body.id }, req.body)
    .then((result) => {
      if (result) {
        res.json({ result: result, message: "NC Detail cancelled successfully!" });
      } else {
        res.json({ message: "This NC cannot be found!" });
      }
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

const cloneNC = async (req: Request, res: Response) => {
  const noti = createMessage(req.body.user.name, "had cloned action on", req.body.id);
  await userController.createNotification(req.body.user.sso, noti);
  let ncDetail = await NCDetail.findOne({ id: req.body.id });
  if (ncDetail) {
    let temp = ncDetail.toObject();
    temp._id = new mongoose.Types.ObjectId();
    const clonedNcDetail = new NCDetail(temp);
    await clonedNcDetail
      .save()
      .then((result) => {
        res.json({ result: result, message: "NC Detail cloned successfully!" });
        return;
      })
      .catch((err) => {
        res.json({ message: err });
      });
  } else {
    res.json({ message: "This NC cannot be found!" });
    return;
  }
};

const sendNCBackToRequestor = async (req: Request, res: Response) => {
  const noti = createMessage(req.body.user.name, "had sent back action on", req.body.id);
  await userController.createNotification(req.body.user.sso, noti);
  req.body.stage = Stage.Created;
  req.body.acceptedDate = null;
  req.body.solvedDate = null;
  await NCDetail.findOneAndUpdate({ id: req.body.id }, req.body)
    .then((result) => {
      if (result) {
        res.json({ result: result, message: "NC Detail back successfully!" });
      } else {
        res.json({ message: "This NC cannot be found!" });
      }
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

const accepNC = async (req: Request, res: Response) => {
  const noti = createMessage(req.body.user.name, "had accepted action on", req.body.id);
  await userController.createNotification(req.body.user.sso, noti);
  req.body.stage = Stage.Accepted;
  req.body.acceptedDate = new Date();
  await NCDetail.findOneAndUpdate({ id: req.body.id }, req.body)
    .then((result) => {
      if (result) {
        res.json({ result: result, message: "NC Detail accepted successfully!" });
      } else {
        res.json({ message: "This NC cannot be found!" });
      }
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

const solveNC = async (req: Request, res: Response) => {
  const noti = createMessage(req.body.user.name, "had solved action on", req.body.id);
  await userController.createNotification(req.body.user.sso, noti);
  req.body.stage = Stage.Solved;
  req.body.solvedDate = new Date();
  await NCDetail.findOneAndUpdate({ id: req.body.id }, req.body)
    .then((result) => {
      if (result) {
        res.json({ result: result, message: "NC Detail solved successfully!" });
      } else {
        res.json({ message: "This NC cannot be found!" });
      }
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

const closeNC = async (req: Request, res: Response) => {
  const noti = createMessage(req.body.user.name, "had closed action on", req.body.id);
  await userController.createNotification(req.body.user.sso, noti);
  req.body.stage = Stage.Closed;
  req.body.closedDate = new Date();
  await NCDetail.findOneAndUpdate({ id: req.body.id }, req.body)
    .then((result) => {
      if (result) {
        res.json({ result: result, message: "NC Detail closed successfully!" });
      } else {
        res.json({ message: "This NC cannot be found!" });
      }
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

const deleteOneNC = async (req: Request, res: Response) => {
  const noti = createMessage(req.body.user.name, "had deleted action on", req.params.id);
  await userController.createNotification(req.body.user.sso, noti);
  await NCDetail.findOneAndDelete({ id: req.params.id })
    .then((result) => {
      if (result) {
        res.json({ result: result, message: "NC Detail deleted successfully!" });
      } else {
        res.json({ message: "This NC cannot be found!" });
      }
    })
    .catch((err) => {
      res.json({ message: err });
    });
};

const getMyNCs = async (req: Request, res: Response) => {
  const ncDetails = await NCDetail.find({ creator: req.body.user.sso });
  res.json(ncDetails);
};

const getNameBySSO = async (sso: string) => {
  const user = await User.findOne({ sso: sso });
  if (user) {
    return user.name;
  } else {
    return null;
  }
};

const getNameById = async (req: Request, res: Response) => {
  const name = await getNameBySSO(req.params.sso);
  if (name !== null) {
    res.json({ result: name });
  } else {
    res.json({ message: "User not found" });
  }
};

const exportMyNCToExcel = async (req: Request, res: Response) => {
  const creator = req.body.user.sso;
  const creatorName = await getNameBySSO(creator);
  let counter = 1;
  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet("NC_Report");
  worksheet.columns = [
    { header: "No.", key: "no", width: 10 },
    { header: "NC ID", key: "id", width: 20 },
    { header: "NC Title", key: "problemTitle", width: 32 },
    { header: "NC Description", key: "problemDescription", width: 32 },
    { header: "Creator", key: "creator", width: 15 },
    { header: "Created Date", key: "createdDate", width: 15 },
    { header: "Accepted Date", key: "acceptedDate", width: 15 },
    { header: "Solved Date", key: "solvedDate", width: 15 },
    { header: "Closed Date", key: "closedDate", width: 15 },
    { header: "Closed Date", key: "cancelledDate", width: 15 },
    { header: "Stage", key: "stage", width: 15 },
  ];
  const ncDetails = await NCDetail.find({ creator: creator });
  ncDetails.forEach((ncDetail: any) => {
    ncDetail.creator = creatorName;
    ncDetail.stage = StageString[ncDetail.stage.toString() as keyof typeof StageString];
    ncDetail.no = counter++;
    worksheet.addRow(ncDetail);
  });
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=" + "NC_Details.xlsx");
  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
};

const countNumberOfEachDetectionPhase = async (req: Request, res: Response) => {
  const ncDetails = await NCDetail.find({});
  const detectionPhases = {};
  ncDetails.forEach((ncDetail: any) => {
    if (detectionPhases[ncDetail.phaseDetection] !== undefined) {
      detectionPhases[ncDetail.phaseDetection]++;
    } else {
      detectionPhases[ncDetail.phaseDetection] = 1;
    }
  });
  res.json(detectionPhases);
};

const countNumberOfEachSymptomCodeL0 = async (req: Request, res: Response) => {
  const ncDetails = await NCDetail.find({});
  const symptomCodeL0s = {};
  ncDetails.forEach((ncDetail: any) => {
    if (symptomCodeL0s[ncDetail.symptomCodeL0] !== undefined) {
      symptomCodeL0s[ncDetail.symptomCodeL0]++;
    } else {
      symptomCodeL0s[ncDetail.symptomCodeL0] = 1;
    }
  });
  res.json(symptomCodeL0s);
};

const countNumberOfEachProductType = async (req: Request, res: Response) => {
  const ncDetails = await NCDetail.find({});
  const productTypes = {};
  ncDetails.forEach((ncDetail: any) => {
    if (productTypes[ncDetail.productType] !== undefined) {
      productTypes[ncDetail.productType]++;
    } else {
      productTypes[ncDetail.productType] = 1;
    }
  });
  res.json(productTypes);
};

/**
 * Hàm tạo thông báo.
 *
 * @param {string} ssoUser - Tên người dùng SSO
 * @param {string} action - Hành động được thực hiện
 * @param {string} ncID - ID của Non Conformity
 *
 * @returns {{
 *   solution: string,
 *   ssoUser: string,
 *   action: string,
 *   ncID: string,
 *   seen: boolean,
 * }}
 */
const createMessage = (ssoUser: string, action: string, ncID: string) => {
  return {
    solution: "Grid Solutions",
    ssoUser: ssoUser,
    action: action,
    ncID: ncID,
    seen: false,
  };
};

const ncgController = {
  getMasterData,
  getInternalUers,
  uploadFile,
  getAllNCs,
  getOneNC,
  createNC,
  saveNC,
  cancelNC,
  cloneNC,
  sendNCBackToRequestor,
  accepNC,
  solveNC,
  closeNC,
  deleteOneNC,
  getMyNCs,
  getNameBySSO,
  getNameById,
  exportMyNCToExcel,
  countNumberOfEachDetectionPhase,
  countNumberOfEachSymptomCodeL0,
  countNumberOfEachProductType,
};

export default ncgController;
