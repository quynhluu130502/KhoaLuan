import { Router } from "express";
import ncgController from "../controllers/ncgController";
import upload from "../middlewares/multerConfig";
import verifyToken from "../middlewares/verifyToken";

const ncgRouter = Router();

export default ncgRouter;

ncgRouter.get("/masterData", ncgController.getMasterData);

ncgRouter.get("/internalUsers", ncgController.getInternalUers);

ncgRouter.post("/upload", upload.array("file", 6), ncgController.uploadFile);

ncgRouter.post("/create", verifyToken, ncgController.createNC);

ncgRouter.post("/clone", verifyToken, ncgController.cloneNC);

ncgRouter.get("/list", ncgController.getAllNCs);

ncgRouter.get("/get/:id", ncgController.getOneNC);

ncgRouter.patch("", verifyToken, ncgController.saveNC);

ncgRouter.patch("/cancel", verifyToken, ncgController.cancelNC);

ncgRouter.put("/accept", verifyToken, ncgController.accepNC);

ncgRouter.put("/solve", verifyToken, ncgController.solveNC);

ncgRouter.put("/reject", verifyToken, ncgController.sendNCBackToRequestor);

ncgRouter.put("/close", verifyToken, ncgController.closeNC);

ncgRouter.delete("/:id", verifyToken, ncgController.deleteOneNC);

ncgRouter.get("/myNCs", verifyToken, ncgController.getMyNCs);

ncgRouter.get("/getNameBySSO/:sso", ncgController.getNameById);

ncgRouter.get("/exportExcel/myNC", verifyToken, ncgController.exportMyNCToExcel);

ncgRouter.get("/count/detectionPhase", ncgController.countNumberOfEachDetectionPhase);

ncgRouter.get("/count/symptomCodeL0", ncgController.countNumberOfEachSymptomCodeL0);

ncgRouter.get("/count/productType", ncgController.countNumberOfEachProductType);
