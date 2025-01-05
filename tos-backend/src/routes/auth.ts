import { Router } from "express";
import { deleteUser, getAllUsers, Login, Register, updateUser } from "../handler/auth";
import { validateData } from "../middleware/schemaValidation";
import { EditUserSchema, LoginSchema, RegisterSchema } from "../schema/auth";

const authRoute = Router()

authRoute.post('/login', validateData(LoginSchema), Login);
authRoute.post('/register', validateData(RegisterSchema), Register);
authRoute.put('/:id', validateData(EditUserSchema), updateUser)
authRoute.delete('/:id', deleteUser)
authRoute.get('/', getAllUsers)

export default authRoute
