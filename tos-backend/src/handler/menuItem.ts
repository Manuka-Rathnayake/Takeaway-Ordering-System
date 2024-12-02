import { Request, Response } from "express";

export const Login = async (req: Request, res: Response) => {
  try {

    return res.status(201).json({ msg: `` })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ msg: "Internal Server" })

  }

}

