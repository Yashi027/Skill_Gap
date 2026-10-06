import express from 'express';
import protect from '../middleware/auth.js';

const gitRouter = express.Router();

export default gitRouter;