import { Router } from "express";
import Visit from "../models/Visit.js";
import { dbReady } from "../config/db.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/visit", async (req, res) => {
    if (dbReady()) {
        await Visit.create({ path: req.body.path, referrer: req.body.referrer, ua: req.headers["user-agent"] }).catch(() => { });
    }
    res.json({ ok: true });
});

router.get("/summary", protect, async (req, res, next) => {
    try {
        const [total, today] = await Promise.all([
            Visit.countDocuments(),
            Visit.countDocuments({ createdAt: { $gte: new Date(Date.now() - 864e5) } }),
        ]);
        const topPaths = await Visit.aggregate([
            { $group: { _id: "$path", count: { $sum: 1 } } },
            { $sort: { count: -1 } }, { $limit: 10 },
        ]);
        res.json({ total, today, topPaths });
    } catch (err) { next(err); }
});

export default router;
