import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes.js"
import profileRouter from "./routes/profileRoutes.js";
import gitRouter from "./routes/githubRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({origin: allowedOrigins, credentials: true}));
app.use(express.json())

app.use("/api/auth",authRoutes);
app.use("/api/profile",profileRouter);
app.use('/api/github',gitRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`SkillGap APi running on PORT ${PORT}`));