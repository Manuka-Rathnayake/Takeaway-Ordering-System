import { Router, Request, Response } from "express";

const route = Router()

route.get('/', async (req: Request, res: Response) => {
  res.json({ msg: "local" })
});

export default route
