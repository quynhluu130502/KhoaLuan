import { Router, Request, Response, NextFunction } from "express";
import ncgController from "../controllers/ncgController";
import upload from "../middlewares/multerConfig";

const ncgRouter = Router();

export default ncgRouter;

ncgRouter.get("/masterData", ncgController.getMasterData);

ncgRouter.get("/internalUsers", ncgController.getInternalUers);

ncgRouter.post("/upload", upload.array("file", 6), ncgController.uploadFile);

ncgRouter.post("/create", ncgController.createNC);

ncgRouter.post("/clone", ncgController.cloneNC);

ncgRouter.get("/list", ncgController.getAllNCs);

ncgRouter.get("/get/:id", ncgController.getOneNC);

ncgRouter.patch("", ncgController.saveNC);

ncgRouter.patch("/cancel", ncgController.cancelNC);

ncgRouter.put("", ncgController.accepNC);

ncgRouter.put("/back", ncgController.sendNCBackToRequestor);

ncgRouter.put("/close", ncgController.closeNC);

ncgRouter.delete("/:id", ncgController.deleteOneNC);

ncgRouter.get("/myNCs", ncgController.getMyNCs);

ncgRouter.get("/getNameBySSO/:sso", ncgController.getNameById);

ncgRouter.get("/exportExcel/myNC", ncgController.exportMyNCToExcel);
