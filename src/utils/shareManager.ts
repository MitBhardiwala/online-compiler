import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SHARE_DIR = path.join(__dirname, '../../shared');
const EXPIRY_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds

interface ShareData {
    code: string;
    language: string;
}

interface CreateShareResult {
    shareId: string;
    expiryTime: Date;
}

// Ensure shared directory exists
fs.mkdir(SHARE_DIR, { recursive: true }).catch(console.error);

// Store of active share IDs and their timeout handlers
const activeShares = new Map<string, NodeJS.Timeout>();

function generateShareId(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

async function createShare(code: string, language: string): Promise<CreateShareResult> {
    let shareId: string;
    do {
        shareId = generateShareId();
    } while (activeShares.has(shareId));

    const shareData: ShareData = {
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

async function deleteShare(shareId: string): Promise<void> {
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

async function getSharedCode(shareId: string): Promise<ShareData | null> {
    const filePath = path.join(SHARE_DIR, `${shareId}.json`);
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data) as ShareData;
    } catch (error) {
        return null;
    }
}

export {
    createShare,
    getSharedCode,
    deleteShare
};
