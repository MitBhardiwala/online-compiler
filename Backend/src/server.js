import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import compilerRoutes from './routes/compiler.js';
import shareRouter from './routes/share.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import aiRouter from './routes/ai.js';
import emailRouter from './routes/email.js';
import logger from './utils/logger.js';
import requestLogger from './middleware/requestLogger.js';
import { ensureTempDir } from "./utils/fileHelper.js";
import config from './config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*', // Restrict CORS in production
    methods: ['GET', 'POST']
}));

ensureTempDir();

// Increase payload limit if needed
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(requestLogger);

// Basic security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Routes
app.use('/api/compiler', compilerRoutes);
app.use('/api/share', shareRouter);
app.use('/api/ai', aiRouter);
app.use('/api/email', emailRouter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

// Cleanup temp files periodically
const TEMP_DIR = path.join(__dirname, '../temp');
setInterval(async () => {
    try {
        const files = await fs.readdir(TEMP_DIR);
        for (const file of files) {
            const filePath = path.join(TEMP_DIR, file);
            const stats = await fs.stat(filePath);
            // Remove files older than 1 hour
            if (Date.now() - stats.mtime.getTime() > 3600000) {
                await fs.unlink(filePath);
            }
        }
    } catch (error) {
        logger.error('Temp cleanup error', { error: error.message, stack: error.stack });
    }
}, 3600000); // Run every hour

// Start server
app.listen(config.port, () => {
    logger.info('Server started', {
        port: config.port,
        nodeEnv: config.nodeEnv
    });
}); 