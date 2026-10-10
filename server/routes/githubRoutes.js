import express from 'express';
import protect from '../middleware/auth.js';
import { analyzeGithubUser } from '../controllers/githubController.js';

const gitRouter = express.Router();

gitRouter.get("/:username", protect, analyzeGithubUser);

export default gitRouter;