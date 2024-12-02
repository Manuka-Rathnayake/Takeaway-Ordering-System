import { Request, Response } from "express";
import { IUsers, Users } from "../db/schema";
import bcrypt from "bcrypt";
// import mongoose, { MongooseError } from "mongoose";
// import { handleMongooseError } from "../utils/ErrorHandle";
import JsonWebToken from "jsonwebtoken";

export const Register = async (req: Request<{}, {}, IUsers>, res: Response) => {
  try {

    const hashedpwd = await bcrypt.hash(req.body.password, 10);

    const newUser = new Users({
      username: req.body.username,
      email: req.body.email,
      phonenumber: req.body.phonenumber,
      role: req.body.role,
      nic: req.body.nic,
      password: hashedpwd,
    });

    await newUser.save();
    return res.status(201).json({ msg: `${req.body.email} is created!` })
  } catch (e: any) {
    // if (e instanceof MongooseError || e.code === 11000) {
    //   const m_err = handleMongooseError(e)
    //   return res.status(400).json(m_err)
    // }
    console.log(e)
    return res.status(500).json({ msg: "Internal Server" })

  }
}

interface LoginReq {
  section: string;
  email: string;
  password: string;
}

export const Login = async (req: Request<{}, {}, LoginReq>, res: Response) => {
  try {
    const { section, email, password } = req.body

    const user = await Users.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ msg: "This Email is Not Registed!!!" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json("Invalid password !!!")
    }

    const token = JsonWebToken.sign(
      {
        id: user._id,
        role: user.role,
        section: section
      },
      (process.env.JWT_SECRET as string),
      {
        expiresIn: "24h"
      }
    )

    res.cookie("tos_access", token, { maxAge: 24 * 60 * 60 * 1000 })
    return res.status(200).json({ token: token })

  } catch (e) {
    console.log(e)
    return res.status(500).json({ msg: "Internal Server" })
  }
}

//
// try {
//
//   return res.status(201).json({ msg: `` })
// } catch (e) {
//   console.log(e)
//   return res.status(500).json({ msg: "Internal Server" })
//
// }
