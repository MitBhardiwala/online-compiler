import express from 'express';
const router = express.Router();
import { createShare, getSharedCode } from '../utils/shareManager.js';

router.post('/generate-sharing-link', async (req, res) => {
    try {
        const { code, language } = req.body;
        
        if (!code) {
            return res.status(400).json({ 
                success: false, 
                error: 'Code is required' 
            });
        }

        if (!language) {
            return res.status(400).json({ 
                success: false, 
                error: 'Language is required' 
            });
        }

        const { shareId, expiryTime } = await createShare(code, language);
        const shareLink = `${shareId}`;

        res.json({
            success: true,
            shareLink,
            expiryTime
        });
    } catch (error) {
        console.error('Share generation error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to generate share link' 
        });
    }
});

router.get('/:shareId', async (req, res) => {
    const { shareId } = req.params;
    const shareData = await getSharedCode(shareId);
    
    if (!shareData) {
        return res.status(404).json({
            success: false,
            error: 'Shared code not found or expired'
        });
    }
    
    res.json({
        success: true,
        code: shareData.code,
        language: shareData.language
    });
});

export default router; 