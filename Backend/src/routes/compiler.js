import express from 'express';
const router = express.Router();
import { executeCode } from '../controllers/compilerController.js';

router.post('/execute', executeCode);

export default router; 