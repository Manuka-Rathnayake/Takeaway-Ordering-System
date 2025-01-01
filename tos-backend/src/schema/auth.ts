import { z } from "zod";


export const RegisterSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  phonenumber: z.string(),
  role: z.string(),
  nic: z.string(),
  password: z.string()
});

export const LoginSchema = z.object({
  section: z.string(),
  email: z.string().email(),
  password: z.string()
});
