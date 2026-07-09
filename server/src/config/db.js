import mongoose from "mongoose";

export async function connectDB() {
    const uri = process.env.MONGODB_URI;
    if (!uri) return console.warn("⚠ No MONGODB_URI — running without persistence (dev mode).");
    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected");
    } catch (err) {
        console.warn("⚠ MongoDB connection failed — continuing without persistence:", err.message);
    }
}

export const dbReady = () => mongoose.connection.readyState === 1;
