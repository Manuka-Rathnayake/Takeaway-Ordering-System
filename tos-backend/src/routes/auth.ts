import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  Login,
  logOut,
  Register,
  updateUser,
  verifyAuth,
} from "../handler/auth";
import { validateData } from "../middleware/schemaValidation";
import { EditUserSchema, LoginSchema, RegisterSchema } from "../schema/auth";
import { authMiddleware } from "../middleware/auth";

const authRoute = Router();

authRoute.post("/login", validateData(LoginSchema), Login);
authRoute.post("/register", validateData(RegisterSchema), Register);
authRoute.put("/:id", validateData(EditUserSchema), updateUser);
authRoute.delete("/:id", deleteUser);
authRoute.get("/", getAllUsers);
authRoute.get("/verify", authMiddleware("user", "admin", "chef"), verifyAuth);
authRoute.get("/logout", authMiddleware("user", "admin", "chef"), logOut);

export default authRoute;
