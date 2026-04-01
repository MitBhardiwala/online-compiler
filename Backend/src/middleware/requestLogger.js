import logger from '../utils/logger.js';

function requestLogger(req, res, next) {
    const startedAt = Date.now();

    // Clean, one-line incoming log
    logger.info(`--> [REQ] ${req.method} ${req.originalUrl}`, { ip: req.ip });

    // Intercept res.send to capture the response body
    const originalSend = res.send;
    let responseBody;
    res.send = function (body) {
        responseBody = body;
        return originalSend.apply(this, arguments);
    };

    // Clean, one-line completed log
    res.on('finish', () => {
        const durationMs = Date.now() - startedAt;
        
        let parsedResponse = responseBody;
        if (typeof responseBody === 'string') {
            try {
                parsedResponse = JSON.parse(responseBody);
            } catch (e) {
                // Keep as string if not JSON
            }
        }

        logger.info(`<-- [RES] ${req.method} ${req.originalUrl}`, { 
            status: res.statusCode, 
            durationMs,
            response: parsedResponse
        });
    });

    next();
}

export default requestLogger;