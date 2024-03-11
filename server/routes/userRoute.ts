import { Router } from "express";
import userController from "../controllers/userController";
import { sendContactForm } from "../configs/sendMail";

const userRouter = Router();

userRouter.get("/", userController.getAllUsers);

userRouter.get("/name", userController.getNameOfUser);

userRouter.post("/", userController.createUser);

userRouter.post("/get", userController.getUserById);

userRouter.patch("/", userController.updateUser);

userRouter.patch("/password", userController.updatePassword);

userRouter.post("/delete", userController.deleteUser);

userRouter.post("/login", userController.login);

userRouter.post("/refreshToken", userController.refreshToken);

userRouter.get("/protected", userController.isAuthorized);

userRouter.post("/logout", userController.logOut);

userRouter.post("/sendContactForm", sendContactForm);

export default userRouter;
