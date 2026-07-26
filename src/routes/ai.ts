import express from 'express';
import { generateCode, generateFileName, convertCode, editCode } from '../controllers/aiController.js';
const router = express.Router();

router.post('/generate', generateCode);
router.post('/generate-filename', generateFileName);
router.post('/convert', convertCode);
router.post('/edit', editCode);

export default router;
