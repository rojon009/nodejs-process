const http = require('http');

// Function to create a large object in memory
function createLargeObject(size) {
    return {
        data: 'x'.repeat(size * 1024 * 1024), // size in MB
        timestamp: Date.now()
    };
}

// Store objects to demonstrate memory usage
let objects = [];

const server = http.createServer((req, res) => {
    if (req.url === '/allocate') {
        // Create a 1MB object
        objects.push(createLargeObject(1));
        
        const memoryUsage = process.memoryUsage();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: 'Allocated 1MB of memory',
            memoryMetrics: {
                heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
                heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
                external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
            },
            objectCount: objects.length
        }));
    } else if (req.url === '/buffer') {
        // Create a Buffer to demonstrate external memory
        const buffer = Buffer.alloc(1024 * 1024); // 1MB buffer
        
        const memoryUsage = process.memoryUsage();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: 'Created 1MB buffer',
            memoryMetrics: {
                heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
                heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
                external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
            }
        }));
    } else if (req.url === '/status') {
        const memoryUsage = process.memoryUsage();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            memoryMetrics: {
                heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
                heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
                external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
            },
            objectCount: objects.length
        }));
    } else {
        res.writeHead(404);
        res.end();
    }
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Memory metrics demo server running on port ${PORT}`);
    console.log('Endpoints:');
    console.log('  GET /allocate - Allocates 1MB of JavaScript heap memory');
    console.log('  GET /buffer   - Creates 1MB buffer (external memory)');
    console.log('  GET /status   - Shows current memory metrics');
});

// Memory monitoring
setInterval(() => {
    const memoryUsage = process.memoryUsage();
    console.log('\nMemory Metrics:', {
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
    });
    console.log('Object count:', objects.length);
}, 5000); 