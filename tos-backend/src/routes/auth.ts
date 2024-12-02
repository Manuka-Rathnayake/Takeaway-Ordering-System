import { Router } from "express";
import { Login, Register } from "../handler/auth";
import { validateData } from "../middleware/schemaValidation";
import { LoginSchema, RegisterSchema } from "../schema/auth";

const authRoute = Router()

authRoute.post('/login', validateData(LoginSchema), Login);
authRoute.post('/register', validateData(RegisterSchema), Register);

export default authRoute
