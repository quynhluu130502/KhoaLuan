import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, JwtPayload, verify } from "jsonwebtoken";

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader) {
    const token = authorizationHeader.split(" ")[1];
    try {
      const data: JwtPayload = verify(token, process.env.TOKEN_SECRET!) as JwtPayload;
      if (!data) {
        res.status(401).send("Invalid token");
        return;
      }
      req.body.user = data;
      next();
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        res.status(401).json({ message: "Token expired" });
        return;
      } else {
        res.status(401).json({ message: "Invalid token" });
        return;
      }
    }
  } else {
    res.status(401).send("Authorization header missing");
    return;
  }
};

export default verifyToken;
