import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        tag: String,
        desc: String,
        tech: [String],
        challenge: String,
        solution: String,
        impact: String,
        demo: String,
        repo: String,
        order: { type: Number, default: 0 },
        published: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
