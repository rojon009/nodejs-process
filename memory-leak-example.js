const http = require('http');

// Simulated database or cache that grows without bounds
let leakyCache = new Map();

// Function that creates a memory leak by storing data without cleanup
function createMemoryLeak() {
    const data = {
        timestamp: new Date().toISOString(),
        largeString: 'x'.repeat(1024 * 1024), // 1MB of data
        randomData: Math.random().toString(36).repeat(1000)
    };
    
    // Store data with a timestamp key
    leakyCache.set(Date.now(), data);
    
    // Intentionally not cleaning up old entries
    // This will cause the cache to grow indefinitely
}

// Create a server that triggers the memory leak
const server = http.createServer((req, res) => {
    if (req.url === '/leak') {
        // Create memory leak on each request
        createMemoryLeak();
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: 'Memory leak created',
            cacheSize: leakyCache.size,
            timestamp: new Date().toISOString()
        }));
    } else if (req.url === '/status') {
        // Return current memory status
        const memoryUsage = process.memoryUsage();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            memoryUsage: {
                rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
                heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
                heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
                external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
            },
            cacheSize: leakyCache.size,
            timestamp: new Date().toISOString()
        }));
    } else {
        res.writeHead(404);
        res.end();
    }
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Memory leak demo server running on port ${PORT}`);
    console.log(`Process ID: ${process.pid}`);
    console.log('Endpoints:');
    console.log('  GET /leak   - Creates a memory leak');
    console.log('  GET /status - Shows memory usage');
});

// Memory monitoring
setInterval(() => {
    const memoryUsage = process.memoryUsage();
    console.log('\nMemory Usage:', {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
    });
    console.log('Cache size:', leakyCache.size, 'entries');
}, 5000); // Log every 5 seconds

// Handle process termination
process.on('SIGINT', () => {
    console.log('\nCleaning up...');
    leakyCache.clear(); // Clear the leaky cache
    process.exit(0);
}); 