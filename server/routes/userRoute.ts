import { Router } from "express";
import userController from "../controllers/userController";
import { sendContactForm } from "../configs/sendMail";
import verifyToken from "../middlewares/verifyToken";

const userRouter = Router();

userRouter.get("/", userController.getAllUsers);

userRouter.get("/name", verifyToken, userController.getNameOfUser);

userRouter.post("/", userController.createUser);

userRouter.post("/get", userController.getUserById);

userRouter.patch("/", userController.updateUser);

userRouter.patch("/password", userController.updatePassword);

userRouter.post("/delete", userController.deleteUser);

userRouter.post("/login", userController.login);

userRouter.post("/refreshToken", userController.refreshToken);

userRouter.get("/protected", verifyToken, userController.isAuthorized);

userRouter.post("/logout", userController.logOut);

userRouter.get("/notifications", verifyToken, userController.getNotifications);

userRouter.patch("/notifications/seen", verifyToken, userController.setSeenNotification);

userRouter.post("/sendContactForm", sendContactForm);

export default userRouter;
