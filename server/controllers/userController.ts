import { Request, Response } from "express";
import { verify, sign, JwtPayload } from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user";

const getAllUsers = async (req: Request, res: Response) => {
  await User.find({})
    .select("-pass -salt")
    .then((users: any) => {
      res.json(users);
    })
    .catch((err: any): void => {
      console.log(err);
    });
};

const createUser = async (req: Request, res: Response) => {
  if (!req.body.email || !req.body.name || !req.body.pass) {
    return res.status(400).send({ message: "Missing required fields: email, name, pass" });
  }
  let salt: string = crypto.randomBytes(16).toString("hex");
  let hash: string = crypto.pbkdf2Sync(req.body.pass, salt, 1000, 64, `sha512`).toString(`hex`);
  const user = new User({
    name: req.body!.name,
    email: req.body!.email,
    language: req.body?.language,
    role: req.body?.role,
    job_function: req.body?.job_function,
    application: req.body?.application,
    last_login: req.body?.last_login,
    pass: hash,
    salt: salt,
    active: req.body?.active,
  });
  User.create(user)
    .then((user: any) => {
      res.json({ result: user, message: "User created" });
    })
    .catch((err: any): void => {
      res.json({ message: err.message });
    });
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const sso = req.body.sso;
    const user = await User.findOne({ sso: sso }).select("-pass -salt");
    if (user) {
      res.json({ message: "User found", result: user });
    } else {
      res.json({ message: "Document not found" });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Function to generate hash and salt for password
const generateHash = (password: string, salt: string): string => {
  let hash: string = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
  return hash;
};

// Function to generate new random salt
const generateSalt = (): string => {
  let salt: string = crypto.randomBytes(16).toString("hex");
  return salt;
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const sso = req.body.sso;
    const user = await User.findOneAndUpdate(
      { sso: sso },
      {
        name: req.body?.name,
        email: req.body?.email,
        language: req.body?.language,
        role: req.body?.role,
        job_function: req.body?.job_function,
        application: req.body?.application,
        last_login: req.body?.last_login,
        active: req.body?.active,
      },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json({ message: "User updated" });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const updatePassword = async (req: Request, res: Response) => {
  try {
    const sso = req.body.sso;
    let oldPass = req.body?.oldPass;
    let newPass = req.body?.newPass;

    // Check if the user want to change password
    if (oldPass && newPass) {
      // Get the password hash and salt from the database
      let temp: any = await User.findOne({ sso: sso }).select("pass salt");

      // If the old password is correct, generate a new hash and salt
      if (temp && temp.pass === generateHash(oldPass, temp.salt)) {
        let salt = generateSalt();
        await User.findOneAndUpdate({ sso: sso }, { salt: salt, pass: generateHash(newPass, salt) }, { new: true });
        res.status(200).json({ message: "Password updated" });
        return;
      } else {
        res.status(400).json({ message: "Old password is incorrect" });
        return;
      }
    } else {
      res.status(400).json({ message: "Missing required fields: oldPass, newPass" });
      return;
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const sso = req.body.sso;
    const user = await User.findOneAndDelete({ sso: sso }, { new: true });
    if (!user) {
      res.status(404).json({ message: "Document not found" });
      return;
    } else {
      res.sendStatus(200);
      return;
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const deleteAllUsers = async (req: Request, res: Response) => {
  try {
    await User.deleteMany({});
    res.status(200).json({ message: "All users deleted" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    let sso = req.body.sso;
    let pass = req.body.pass;
    let user: any = await User.findOneAndUpdate(
      { sso: sso },
      {
        last_login: new Date(),
      }
    ).select("-_id");
    if (!user) {
      res.json({ message: "User not found" });
      return;
    }
    if (user.pass === generateHash(pass, user.salt)) {
      user.pass = "";
      user.salt = "";
      const accessToken = sign(user.toJSON(), process.env.TOKEN_SECRET!, { expiresIn: "1h", algorithm: "HS256" });
      const refreshToken = sign({ sso: user.sso }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "1d", algorithm: "HS256" });
      res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000, sameSite: "none" });
      res.json({ message: "Login successful", user: user, token: accessToken });
    } else {
      res.json({ message: "Login failed - Wrong password | Invalid credentials" });
    }
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken == undefined) {
    return res.json({ message: "Invalid token" });
  }
  try {
    const user: JwtPayload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as JwtPayload;
    if (!user) {
      return res.json({ message: "Invalid token" });
    }
    User.findOne({ sso: user.sso })
      .select("-pass -salt -_id")
      .then((data: any) => {
        if (data) {
          const accessToken = sign(data.toJSON(), process.env.TOKEN_SECRET!, { expiresIn: "1h", algorithm: "HS256" });
          const refreshToken = sign({ sso: data.sso }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "1d", algorithm: "HS256" });
          res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000, sameSite: "none" });
          res.json({ token: accessToken, message: "Token refreshed" });
          return;
        }
      });
  } catch (error: any) {
    res.json({ message: `Invalid token. The error is ${error}` });
  }
};

const isAuthorized = async (req: Request, res: Response) => {
  res.json({ message: "Protected data", result: req.body.user });
};

const logOut = async (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logout successful", result: true });
};

const getNameOfUser = async (req: Request, res: Response) => {
  const sso = req.body.user.sso;
  const user = await User.findOne({ sso: sso }).select("name");
  if (user) {
    res.json({ message: "User found", result: user.name });
  } else {
    res.json({ message: "Document not found" });
  }
};

const getNotifications = async (req: Request, res: Response) => {
  const sso = req.body.user.sso;
  const user = await User.findOne({ sso: sso }).select("notifications");
  if (user) {
    res.json({ message: "User found", result: user.notifications });
    return;
  } else {
    res.json({ message: "User not found" });
    return;
  }
};

const createNotification = async (sso: string, notification: any) => {
  notification._id = new Date().getTime();
  await User.updateOne({ sso: sso }, { $push: { notifications: notification } });
};

const setSeenNotification = async (req: Request, res: Response) => {
  const user = await User.updateOne({ sso: req.body.user.sso }, { $set: { "notifications.$[elem].seen": true } }, { arrayFilters: [{ "elem._id": req.body._id }] });
  if (user) {
    res.json({ result: user, message: "Notification updated" });
    return;
  }
  res.json({ message: "Notification not found" });
};

const userController = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  updatePassword,
  deleteUser,
  deleteAllUsers,
  login,
  refreshToken,
  isAuthorized,
  logOut,
  generateHash,
  generateSalt,
  getNameOfUser,
  getNotifications,
  createNotification,
  setSeenNotification,
};

export default userController;
