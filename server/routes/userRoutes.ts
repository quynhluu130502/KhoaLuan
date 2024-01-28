import { Router, Request, Response } from "express";
import crypto from "crypto";
import User from "../models/User";

const router = Router();

// Get all users
router.get("/", async (req: Request, res: Response) => {
  await User.find({})
    .select("-pass -salt")
    .then((users) => {
      res.json(users);
    })
    .catch((err): void => {
      console.log(err);
    });
});

// Create a new user
router.post("/", async (req: Request, res: Response) => {
  if (!req.body.email || !req.body.name || !req.body.pass) {
    return res
      .status(400)
      .send({ error: "Missing required fields: email, name, pass" });
  }
  let salt: string = crypto.randomBytes(16).toString("hex");
  let hash: string = crypto
    .pbkdf2Sync(req.body.pass, salt, 1000, 64, `sha512`)
    .toString(`hex`);
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
    .then((user) => {
      res.json(user);
    })
    .catch((err): void => {
      console.log(err);
    });
});

//Get by ID Method
router.post("/get", async (req: Request, res: Response) => {
  try {
    const sso = req.body.sso;
    const user = await User.findOne({ sso: sso }).select("-pass -salt");
    if (user) {
      res.json({ message: "User found", user: user });
    } else {
      res.json({ message: "Document not found" });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Function to generate hash and salt for password
const generateHash = (password: string, salt: string): string => {
  let hash: string = crypto
    .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
    .toString(`hex`);
  return hash;
};

// Function to generate new random salt
const generateSalt = (): string => {
  let salt: string = crypto.randomBytes(16).toString("hex");
  return salt;
};

// Apply partial updates to a resource by ID
router.patch("/", async (req: Request, res: Response) => {
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
});

// Update password by ID
router.patch("/password", async (req: Request, res: Response) => {
  try {
    const sso = req.body.sso;
    let oldPass = req.body?.oldPass;
    let newPass = req.body?.newPass;

    // Check if the user want to change password
    if (oldPass && newPass) {
      // Get the password hash and salt from the database
      let temp = await User.findOne({ sso: sso }).select("pass salt");

      // If the old password is correct, generate a new hash and salt
      if (temp && temp.pass === generateHash(oldPass, temp.salt)) {
        let salt = generateSalt();
        await User.findOneAndUpdate(
          { sso: sso },
          { salt: salt, pass: generateHash(newPass, salt) },
          { new: true }
        );
        res.status(200).json({ message: "Password updated" });
        return;
      } else {
        res.status(400).json({ message: "Old password is incorrect" });
        return;
      }
    } else {
      res
        .status(400)
        .json({ message: "Missing required fields: oldPass, newPass" });
      return;
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

//Delete by ID Method
router.post("/delete", async (req: Request, res: Response) => {
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
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    let sso = req.body.sso;
    let pass = req.body.pass;
    let user = await User.findOne({ sso: sso });
    if (!user) {
      res.json({ message: "User not found" });
      return;
    }
    if (user.pass === generateHash(pass, user.salt)) {
      user.pass = "";
      user.salt = "";
      res.json({ message: "Login successful", user: user });
    } else {
      res.json({ message: "Login failed - Wrong password" });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});
export default router;
