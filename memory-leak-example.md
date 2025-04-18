# Understanding Memory Leaks in Node.js

This guide demonstrates a common memory leak scenario in Node.js applications and how to identify, prevent, and fix them.

## What is a Memory Leak?

A memory leak occurs when a program allocates memory but fails to release it when it's no longer needed. Over time, this leads to increased memory usage, degraded performance, and potentially application crashes.

## The Example

This example demonstrates a typical memory leak scenario using a cache that grows without bounds:

```javascript
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
```

## How the Memory Leak Works

1. **Unbounded Cache Growth**
   - Each request to `/leak` adds a new entry to the cache
   - Entries are never removed
   - Each entry contains ~1MB of data
   - Cache grows indefinitely with each request

2. **Memory Usage Monitoring**
   ```javascript
   setInterval(() => {
       const memoryUsage = process.memoryUsage();
       console.log('\nMemory Usage:', {
           rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
           heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
           heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
           external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
       });
       console.log('Cache size:', leakyCache.size, 'entries');
   }, 5000);
   ```

3. **Memory Metrics Explained**
   - **RSS (Resident Set Size)**: Total memory allocated for the process
   - **HeapTotal**: Total size of the V8 heap
   - **HeapUsed**: Actually used heap memory
   - **External**: Memory used by C++ objects bound to JavaScript objects

## Running the Example

1. Start the server:
   ```bash
   node memory-leak-example.js
   ```

2. Access the endpoints:
   - Create a memory leak: `http://localhost:3000/leak`
   - Check memory status: `http://localhost:3000/status`

3. Observe the memory growth:
   - Watch the console output every 5 seconds
   - Monitor the cache size increasing
   - Observe RSS and heap usage growing

## Common Causes of Memory Leaks

1. **Unbounded Caches**
   - Caches without size limits
   - No expiration mechanism
   - No cleanup strategy

2. **Event Listeners**
   - Not removing event listeners
   - Adding listeners in loops
   - Circular references

3. **Closures**
   - Holding references to large objects
   - Circular references
   - Unintended variable capture

4. **Timers/Intervals**
   - Not clearing intervals
   - Creating new intervals without cleanup
   - Long-running timers

## How to Fix Memory Leaks

1. **Implement Cache Limits**
   ```javascript
   const MAX_CACHE_SIZE = 1000;
   
   function addToCache(key, value) {
       if (leakyCache.size >= MAX_CACHE_SIZE) {
           // Remove oldest entry
           const oldestKey = leakyCache.keys().next().value;
           leakyCache.delete(oldestKey);
       }
       leakyCache.set(key, value);
   }
   ```

2. **Use WeakMap/WeakSet**
   ```javascript
   // WeakMap allows garbage collection of keys
   const weakCache = new WeakMap();
   ```

3. **Implement TTL (Time To Live)**
   ```javascript
   function addToCacheWithTTL(key, value, ttlMs = 3600000) {
       leakyCache.set(key, {
           value,
           expires: Date.now() + ttlMs
       });
   }
   
   // Cleanup expired entries
   setInterval(() => {
       const now = Date.now();
       for (const [key, entry] of leakyCache.entries()) {
           if (entry.expires < now) {
               leakyCache.delete(key);
           }
       }
   }, 60000);
   ```

4. **Proper Cleanup**
   ```javascript
   process.on('SIGINT', () => {
       console.log('\nCleaning up...');
       leakyCache.clear(); // Clear the leaky cache
       process.exit(0);
   });
   ```

## Best Practices

1. **Memory Monitoring**
   - Implement regular memory usage checks
   - Set up alerts for abnormal growth
   - Monitor heap usage patterns

2. **Resource Management**
   - Implement proper cleanup procedures
   - Use appropriate data structures
   - Set limits on resource usage

3. **Code Review**
   - Look for potential memory leaks
   - Check for proper cleanup
   - Review caching strategies

4. **Testing**
   - Load test applications
   - Monitor memory usage over time
   - Test cleanup procedures

## Tools for Memory Leak Detection

1. **Node.js Built-in Tools**
   - `process.memoryUsage()`
   - `--inspect` flag for Chrome DevTools
   - `--heap-prof` for heap profiling

2. **External Tools**
   - Chrome DevTools Memory Profiler
   - Node.js --heap-prof
   - Clinic.js
   - New Relic
   - Datadog

## Next Steps

1. **Implement Memory Leak Detection**
   - Set up monitoring
   - Create alerts
   - Implement logging

2. **Optimize Memory Usage**
   - Review data structures
   - Implement caching strategies
   - Optimize algorithms

3. **Production Considerations**
   - Set memory limits
   - Implement graceful degradation
   - Monitor and alert
