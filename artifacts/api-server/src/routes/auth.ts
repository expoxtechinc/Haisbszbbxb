import { Router, type IRouter } from "express";
import { checkPassword, signToken } from "../middlewares/adminAuth.js";

const router: IRouter = Router();

router.post("/auth/login", (req, res) => {
  const { password } = req.body as { password?: string };
  if (!password || typeof password !== "string") {
    res.status(400).json({ error: "Password is required" });
    return;
  }
  if (!checkPassword(password)) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  const token = signToken(expiresAt);
  res.json({ token, expiresAt });
});

export default router;
