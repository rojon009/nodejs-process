const http = require('http');

// Create a server with route handling and error management
const server = http.createServer((req, res) => {
    try {
        // Set default headers
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');

        // Route handling
        switch (req.url) {
            case '/':
                const homeData = {
                    message: 'Welcome to the homepage',
                    timestamp: new Date().toISOString()
                };
                res.statusCode = 200;
                res.end(JSON.stringify(homeData));
                break;

            case '/about':
                const aboutData = {
                    message: 'About page',
                    version: '1.0.0'
                };
                res.statusCode = 200;
                res.end(JSON.stringify(aboutData));
                break;

            case '/api/status':
                const statusData = {
                    status: 'operational',
                    uptime: process.uptime(),
                    timestamp: new Date().toISOString()
                };
                res.statusCode = 200;
                res.end(JSON.stringify(statusData));
                break;

            default:
                res.statusCode = 404;
                res.end(JSON.stringify({
                    error: 'Not Found',
                    message: 'The requested resource was not found'
                }));
        }
    } catch (error) {
        console.error('Error handling request:', error);
        res.statusCode = 500;
        res.end(JSON.stringify({
            error: 'Internal Server Error',
            message: 'An unexpected error occurred'
        }));
    }
});

// Error handling for the server itself
server.on('error', (error) => {
    console.error('Server error:', error);
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);
    
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

// Handle various termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Try accessing:
    - http://localhost:${PORT}/         (Homepage)
    - http://localhost:${PORT}/about   (About page)
    - http://localhost:${PORT}/api/status (API Status)`);
});