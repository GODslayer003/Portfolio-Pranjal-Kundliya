import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = Router();
const sign = (user) =>
    jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

// One-time admin setup, gated by ADMIN_SETUP_KEY
router.post("/setup", async (req, res, next) => {
    try {
        if (req.body.setupKey !== process.env.ADMIN_SETUP_KEY)
            return res.status(403).json({ error: "Invalid setup key" });
        if (await User.countDocuments()) return res.status(409).json({ error: "Admin already exists" });
        const user = await User.create({ email: req.body.email, password: req.body.password });
        res.status(201).json({ token: sign(user) });
    } catch (err) { next(err); }
});

router.post("/login", async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email }).select("+password");
        if (!user || !(await user.compare(req.body.password || "")))
            return res.status(401).json({ error: "Invalid credentials" });
        res.json({ token: sign(user) });
    } catch (err) { next(err); }
});

export default router;
