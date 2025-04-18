# Understanding Node.js Memory Metrics

This guide demonstrates how to monitor and understand different types of memory usage in Node.js applications using the `process.memoryUsage()` API.

## What are Memory Metrics?

Memory metrics in Node.js provide information about how your application is using memory. The `process.memoryUsage()` method returns an object with different memory measurements:

- **heapTotal**: Total size of the V8 heap
- **heapUsed**: Actually used heap memory
- **external**: Memory used by C++ objects bound to JavaScript objects
- **rss**: Resident Set Size, total memory allocated for the process

## The Example

This example demonstrates different types of memory allocation and how they affect various memory metrics:

```javascript
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
```

## Understanding Memory Types

1. **JavaScript Heap Memory**
   - Managed by V8 engine
   - Used for JavaScript objects
   - Garbage collected
   - Example: `objects.push(createLargeObject(1))`

2. **External Memory**
   - Used by C++ objects
   - Not garbage collected by V8
   - Example: `Buffer.alloc(1024 * 1024)`
   - Common in:
     - Buffers
     - Native modules
     - File handles
     - Network sockets

## Running the Example

1. Start the server:
   ```bash
   node memory-metrics-example.js
   ```

2. Access the endpoints:
   - Allocate heap memory: `http://localhost:3000/allocate`
   - Create external memory: `http://localhost:3000/buffer`
   - Check memory status: `http://localhost:3000/status`

3. Observe the memory changes:
   - Watch heap usage increase with `/allocate`
   - See external memory increase with `/buffer`
   - Monitor both with `/status`

## Memory Monitoring

The example includes periodic memory monitoring:

```javascript
setInterval(() => {
    const memoryUsage = process.memoryUsage();
    console.log('\nMemory Metrics:', {
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
    });
    console.log('Object count:', objects.length);
}, 5000);
```

## Key Differences in Memory Types

1. **Heap Memory vs External Memory**
   - Heap memory is managed by V8's garbage collector
   - External memory requires manual management
   - Different tools for monitoring each type

2. **Memory Leaks**
   - Heap memory leaks: Objects not garbage collected
   - External memory leaks: Resources not properly released
   - Different strategies for fixing each type

## Best Practices

1. **Memory Monitoring**
   - Regular monitoring in production
   - Set up alerts for abnormal growth
   - Track both heap and external memory

2. **Resource Management**
   - Release external resources properly
   - Use appropriate data structures
   - Implement cleanup procedures

3. **Performance Optimization**
   - Minimize memory allocations
   - Reuse objects when possible
   - Use streams for large data

## Common Memory Issues

1. **Heap Memory**
   - Memory fragmentation
   - Garbage collection pauses
   - Object retention

2. **External Memory**
   - Unclosed resources
   - Buffer accumulation
   - Native module leaks

## Tools for Memory Analysis

1. **Node.js Built-in Tools**
   - `process.memoryUsage()`
   - `--inspect` flag
   - `--heap-prof`

2. **External Tools**
   - Chrome DevTools Memory Profiler
   - Clinic.js
   - New Relic
   - Datadog

## Next Steps

1. **Implement Memory Monitoring**
   - Set up regular checks
   - Create alerts
   - Log memory usage

2. **Optimize Memory Usage**
   - Profile your application
   - Identify memory hotspots
   - Implement optimizations

3. **Production Considerations**
   - Set memory limits
   - Monitor memory trends
   - Plan for scaling
