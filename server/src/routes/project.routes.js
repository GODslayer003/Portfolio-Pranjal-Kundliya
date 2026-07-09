import { Router } from "express";
import Project from "../models/Project.js";
import { dbReady } from "../config/db.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res, next) => {
    try {
        if (!dbReady()) return res.json([]); // frontend falls back to local data
        res.json(await Project.find({ published: true }).sort("order"));
    } catch (err) { next(err); }
});

router.post("/", protect, async (req, res, next) => {
    try { res.status(201).json(await Project.create(req.body)); } catch (err) { next(err); }
});
router.put("/:id", protect, async (req, res, next) => {
    try { res.json(await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })); }
    catch (err) { next(err); }
});
router.delete("/:id", protect, async (req, res, next) => {
    try { await Project.findByIdAndDelete(req.params.id); res.json({ ok: true }); }
    catch (err) { next(err); }
});

export default router;
