# Understanding Node.js Process Object

This guide explains the Node.js `process` object and its various features through practical examples.

## What is the Process Object?

The `process` object is a global object in Node.js that provides information about the current Node.js process and allows interaction with it. It's an instance of `EventEmitter` and provides various properties and methods to interact with the operating system.

## Environment Variables

Environment variables are external values that can affect the way programs behave. In Node.js, they're accessed through `process.env`:

```javascript
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const NODE_ENV = process.env.NODE_ENV || 'development';
```

Common uses:
- Configuration settings
- API keys and secrets
- Environment-specific behavior
- Deployment configurations

## Process Information

The process object provides various properties to get information about the current process:

```javascript
console.log(`Process ID: ${process.pid}`);
```

Common process properties:
- `process.pid`: Process ID
- `process.ppid`: Parent Process ID
- `process.platform`: Operating system platform
- `process.version`: Node.js version
- `process.arch`: CPU architecture
- `process.cwd()`: Current working directory

## Process Signals

Signals are software interrupts that tell a program to stop what it's doing and handle a specific event.

1. **SIGTERM**
   - Graceful termination signal
   - Default signal for `kill` command
   - Allows cleanup before shutdown
   ```javascript
   process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
   ```

2. **SIGINT**
   - Interactive termination signal
   - Sent when user presses Ctrl+C
   - Allows graceful shutdown
   ```javascript
   process.on('SIGINT', () => gracefulShutdown('SIGINT'));
   ```

## Error Handling

Node.js provides several ways to handle different types of errors:

1. **Uncaught Exceptions**
   - Catches errors that weren't caught by try-catch blocks
   - Last resort for error handling
   - Should be used for logging and cleanup only
   ```javascript
   process.on('uncaughtException', (error) => {
       console.error('Uncaught Exception:', error);
       gracefulShutdown('uncaughtException');
   });
   ```

2. **Unhandled Rejections**
   - Catches Promise rejections that weren't handled
   - Common in async code
   - Should be used for logging and cleanup
   ```javascript
   process.on('unhandledRejection', (reason, promise) => {
       console.error('Unhandled Rejection at:', promise, 'reason:', reason);
       gracefulShutdown('unhandledRejection');
   });
   ```

## Graceful Shutdown

Proper shutdown handling ensures resources are cleaned up:

```javascript
const gracefulShutdown = (signal) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);
    
    server.close(() => {
        console.log('HTTP server closed');
        console.log('Cleaning up resources...');
        process.exit(0);
    });

    // Force close after timeout
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};
```

## Best Practices

1. **Environment Variables**
   - Always provide fallback values
   - Use meaningful default values
   - Document required environment variables

2. **Error Handling**
   - Always implement graceful shutdown
   - Log errors appropriately
   - Clean up resources before exit

3. **Signal Handling**
   - Handle common signals (SIGTERM, SIGINT)
   - Implement graceful shutdown
   - Set appropriate timeouts

## Testing Process Features

1. **Environment Variables**
   ```bash
   NODE_ENV=production node use-of-process-example.js
   ```

2. **Signal Handling**
   - Press Ctrl+C to test SIGINT
   - Use `kill` command to test SIGTERM
   - Monitor shutdown behavior

3. **Error Handling**
   - Trigger uncaught exceptions
   - Create unhandled rejections
   - Verify cleanup procedures

## Common Use Cases

1. **Production Monitoring**
   - Error logging
   - Graceful shutdown
   - Process management

2. **Development**
   - Environment configuration
   - Debug information
   - Process management

3. **Deployment**
   - Environment-specific settings
   - Resource cleanup
   - Error reporting

## Next Steps

Consider implementing:
- Process clustering
- Load balancing
- Health checks
- Metrics collection
- Logging systems
- Monitoring alerts
