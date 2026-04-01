import express from 'express';
const router = express.Router();
import { sendSuggestionEmail } from '../controllers/emailController.js';

router.post('/suggestions', sendSuggestionEmail);

export default router; 