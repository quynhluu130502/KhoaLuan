import { Router } from "express";
import userController from "../controllers/userController";

const userRouter = Router();

userRouter.get("/", userController.getAllUsers);

userRouter.post("/", userController.createUser);

userRouter.post("/get", userController.getUserById);

userRouter.patch("/", userController.updateUser);

userRouter.patch("/password", userController.updatePassword);

userRouter.post("/delete", userController.deleteUser);

userRouter.post("/login", userController.login);

userRouter.post("/refreshToken", userController.refreshToken);

userRouter.get("/protected", userController.isAuthorized);

userRouter.post("/logout", userController.logOut);

userRouter.get("/name", userController.getNameOfUser);

export default userRouter;
