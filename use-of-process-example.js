const http = require('http');

// Configuration from environment variables with fallbacks
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Create HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        message: 'Server is running',
        environment: NODE_ENV,
        timestamp: new Date().toISOString()
    }));
});

// Start server
server.listen(PORT, HOST, () => {
    console.log(`Server running in ${NODE_ENV} mode at http://${HOST}:${PORT}`);
    console.log(`Process ID: ${process.pid}`);
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);
    
    // Close server and stop accepting new connections
    server.close(() => {
        console.log('HTTP server closed');
        
        // Perform cleanup tasks
        console.log('Cleaning up resources...');
        
        // Exit process
        process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

// Handle different termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
}); 