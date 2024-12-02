import { IncomingMessage } from "http";
import jwtparser from 'jsonwebtoken';

type Roles = "user" | "admin" | "chef";
type Sections = "cashier" | "kitchen" | "admin" | "menu";

type PermissionMap = {
  [Section in Sections]: Roles[];
};

const permission: PermissionMap = {
  cashier: ["user", "admin"],
  kitchen: ["chef"],
  admin: ["admin"],
  menu: ["user", "admin"]
};

export const RoleSectionCheck = (role: Roles, section: Sections): boolean => {
  console.log("RoleSectionCheck", role, section)
  return permission[section].includes(role);
};

// interface wsAuthData{
//   id: string,
//   section: string,
// }
export interface payload {
  id: string,
  role: string,
  section: string
  iat: number,
  exp: number
}

export const wsAuth = (req: IncomingMessage) => {
  let token;
  let authHeader = req.headers.authorization
  console.log(req.headers)
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  } else {
    return;
  }

  try {
    const decode = jwtparser.verify(token, (process.env.JWT_SECRET as string)) as payload;
    console.log(decode)
    const id: any = decode.id
    const section: any = decode.section

    return {
      id: id as string,
      section: section as string
    }

  } catch (e) {
    return;
  }
}

