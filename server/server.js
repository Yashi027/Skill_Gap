import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json())

app.use("/api/auth",authRoutes);

const PORT = process.env.PORT || 5000;

try {
    await connectDB();
    app.listen(PORT, () => console.log(`SkillGap API running on port ${PORT}`));
} catch {
    process.exitCode = 1;
}
