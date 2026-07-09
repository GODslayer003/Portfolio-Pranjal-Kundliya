import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
    {
        path: String,
        referrer: String,
        ua: String,
    },
    { timestamps: true }
);

export default mongoose.model("Visit", visitSchema);
