import express from 'express';
import { sendSuggestionEmail } from '../controllers/emailController.js';
const router = express.Router();

router.post('/suggestions', sendSuggestionEmail);

export default router;
