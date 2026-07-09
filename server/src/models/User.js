import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true, select: false },
        role: { type: String, default: "admin" },
    },
    { timestamps: true }
);

userSchema.pre("save", async function () {
    if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 12);
});
userSchema.methods.compare = function (pw) {
    return bcrypt.compare(pw, this.password);
};

export default mongoose.model("User", userSchema);
