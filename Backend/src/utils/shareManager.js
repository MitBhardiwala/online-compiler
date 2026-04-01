import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SHARE_DIR = path.join(__dirname, '../../shared');
const EXPIRY_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds

// Ensure shared directory exists
fs.mkdir(SHARE_DIR, { recursive: true }).catch(console.error);

// Store of active share IDs and their timeout handlers
const activeShares = new Map();

function generateShareId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

async function createShare(code, language) {
    let shareId;
    do {
        shareId = generateShareId();
    } while (activeShares.has(shareId));

    const shareData = {
        code,
        language
    };

    const filePath = path.join(SHARE_DIR, `${shareId}.json`);
    await fs.writeFile(filePath, JSON.stringify(shareData));

    const timeout = setTimeout(() => deleteShare(shareId), EXPIRY_TIME);
    activeShares.set(shareId, timeout);

    const expiryTime = new Date(Date.now() + EXPIRY_TIME);
    return { shareId, expiryTime };
}

async function deleteShare(shareId) {
    const filePath = path.join(SHARE_DIR, `${shareId}.json`);
    try {
        await fs.unlink(filePath);
    } catch (error) {
        console.error(`Error deleting shared file ${shareId}:`, error);
    }
    
    const timeout = activeShares.get(shareId);
    if (timeout) {
        clearTimeout(timeout);
        activeShares.delete(shareId);
    }
}

async function getSharedCode(shareId) {
    const filePath = path.join(SHARE_DIR, `${shareId}.json`);
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return null;
    }
}

export {
    createShare,
    getSharedCode,
    deleteShare
}; 