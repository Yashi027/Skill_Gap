import express from 'express';
import { CAREER_SKILLS, SKILLS } from '../utils/skills.js';

const skillRouter = express.Router();

skillRouter.get("/catalog", (req,res) => {
    res.json({skills: SKILLS, careers: CAREER_SKILLS});
});

export default skillRouter;