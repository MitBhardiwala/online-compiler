import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';
import config from '../config/config.js';

export const errorHandler = (
    err: Error & { statusCode?: number },
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    logger.error('Unhandled error', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
    });

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        error: {
            message,
            ...(config.nodeEnv === 'development' && { stack: err.stack }),
        },
    });
};

export default errorHandler;
