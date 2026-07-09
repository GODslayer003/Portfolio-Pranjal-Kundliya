import { Router } from "express";
import rateLimit from "express-rate-limit";
import Message from "../models/Message.js";
import { dbReady } from "../config/db.js";
import { sendContactMail } from "../utils/mailer.js";
import { protect } from "../middleware/auth.js";

const router = Router();
const contactLimit = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: { error: "Too many messages, try later." } });

router.post("/", contactLimit, async (req, res, next) => {
    try {
        const { name, email, message } = req.body;
        if (!name?.trim() || !/^\S+@\S+\.\S+$/.test(email || "") || !message?.trim())
            return res.status(400).json({ error: "Valid name, email and message required." });

        if (dbReady()) await Message.create({ name, email, message });
        await sendContactMail({ name, email, message });
        res.status(201).json({ ok: true });
    } catch (err) { next(err); }
});

// Admin: list + mark read
router.get("/", protect, async (req, res, next) => {
    try { res.json(await Message.find().sort("-createdAt").limit(200)); }
    catch (err) { next(err); }
});
router.patch("/:id/read", protect, async (req, res, next) => {
    try { res.json(await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true })); }
    catch (err) { next(err); }
});

export default router;
