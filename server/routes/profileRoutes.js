import express from 'express';
import protect from '../middleware/auth.js';
import { getProfile, getProgress, setCareer, updateSkillRatings } from '../controllers/profileController.js';

const profileRouter = express.Router();

profileRouter.get("/",protect, getProfile);
profileRouter.patch("/career", protect, setCareer);
profileRouter.patch("/skills", protect, updateSkillRatings);
profileRouter.get("/progress", protect, getProgress);

export default profileRouter;