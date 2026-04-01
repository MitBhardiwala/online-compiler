import express from 'express';
const router = express.Router();
import { generateCode, generateFileName, convertCode, editCode } from '../controllers/aiController.js';

router.post('/generate', generateCode);
router.post('/generate-filename', generateFileName);
router.post('/convert', convertCode);
router.post('/edit', editCode);

export default router; 