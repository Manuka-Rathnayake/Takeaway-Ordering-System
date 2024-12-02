import { NextFunction, Request, Response } from "express";
import jwtparser, { JwtPayload } from 'jsonwebtoken';
import { RoleSectionCheck } from "../utils/roleauth";
import { Stream } from "stream";

interface payload {
  id: string,
  role: string,
  section: string
  iat: number,
  exp: number
}
export const authMiddleware = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let token;
    let authCookie = req.cookies["tos_access"]
    let authHeader = req.headers.authorization
    if (authCookie) {
      token = authCookie
    } else if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    } else {
      return res.status(401).json({ msg: "authorization denied!" })
    }

    // console.log(token)


    try {
      const decode = jwtparser.verify(token, (process.env.JWT_SECRET as string)) as payload;
      console.log(decode)
      const role: any = decode.role
      const section: any = decode.section

      if (role != "admin") {
        if (!roles.includes(role) && !RoleSectionCheck(role, section)) {
          return res.status(401).json({ msg: "unauthorized route" })
        }
      }

      req.user = decode
      return next()
    } catch (e) {
      res.status(400).json("token isn't valid")
    }
  }
}
