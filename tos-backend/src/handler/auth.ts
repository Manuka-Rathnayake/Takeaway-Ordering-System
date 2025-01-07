import { Request, Response } from "express";
import { IUsers, Users } from "../db/schema";
import bcrypt from "bcrypt";
// import mongoose, { MongooseError } from "mongoose";
// import { handleMongooseError } from "../utils/ErrorHandle";
import JsonWebToken from "jsonwebtoken";
import { EditUserSchema, RegisterSchema } from "../schema/auth";
import { Roles, RoleSectionCheck, Sections } from "../utils/roleauth";

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
    return res.status(201).json({ msg: `${req.body.email} is created!` });
  } catch (e: any) {
    // if (e instanceof MongooseError || e.code === 11000) {
    //   const m_err = handleMongooseError(e)
    //   return res.status(400).json(m_err)
    // }
    console.log(e);
    return res.status(500).json({ msg: "Internal Server" });
  }
};

interface LoginReq {
  section: string;
  email: string;
  password: string;
}

export const Login = async (req: Request<{}, {}, LoginReq>, res: Response) => {
  try {
    const { section, email, password } = req.body;

    const user = await Users.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ msg: "This Email is Not Registed!!!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json("Invalid password !!!");
    }

    const role: Roles = user.role as Roles
    const sec: Sections = section as Sections
    if (!RoleSectionCheck(role, sec)) {
      return res.status(301).json("unauthorized route !!!");
    }

    const token = JsonWebToken.sign(
      {
        id: user._id,
        role: user.role,
        section: section,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "24h",
      },
    );

    res.cookie("tos_access", token, {
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ token: token });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server" });
  }
};

export const updateUser = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    // Validate the request body
    const validatedData = EditUserSchema.parse(req.body);

    // Hash password if it is being updated
    // if (validatedData.password) {
    //   validatedData.password = await bcrypt.hash(validatedData.password, 10);
    // }

    const updatedUser = await Users.findByIdAndUpdate(
      req.params.id,
      validatedData,
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validation
      },
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res
      .status(200)
      .json({ msg: "User updated successfully", user: updatedUser });
  } catch (e: any) {
    console.log(e);
    return res.status(400).json({ msg: e.message || "Invalid request" });
  }
};

export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const deletedUser = await Users.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res
      .status(200)
      .json({ msg: "User deleted successfully", user: deletedUser });
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Fetch all users, excluding the password field
    const users = await Users.find().select("-password");

    return res.status(200).json({ users });
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const verifyAuth = async (req: Request, res: Response) => {
  try {
    const data = req.user;
    res.status(200).json({
      role: data.role,
      section: data.section,
    });
  } catch (e: any) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const logOut = async (req: Request, res: Response) => {
  res.clearCookie('tos_access')
  return res.json({ msg: "logout" })
}

