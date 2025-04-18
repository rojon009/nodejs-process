# Creating a Simple Node.js Server

This guide explains how to create a basic HTTP server using Node.js with proper error handling, route management, and security practices.

## Basic Server Setup

Here's a simple example of creating a server:

```javascript
const http = require('http');

// Create a server
const server = http.createServer((req, res) => {
    res.end('Hello World');
});

// Start the server
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
```

## Key Components Explained

1. **HTTP Module**
   - The `http` module is a built-in Node.js module
   - It provides functionality to create HTTP servers and clients
   - Import it using `require('http')`

2. **Server Creation**
   - `http.createServer()` creates a new HTTP server
   - Takes a callback function that handles requests and responses
   - The callback receives two parameters:
     - `req`: The request object (contains information about the incoming request)
     - `res`: The response object (used to send data back to the client)

3. **Server Listening**
   - `server.listen()` starts the server
   - Takes parameters:
     - Port number (e.g., 3000)
     - Optional callback function that runs when server starts
   - Can use environment variables: `process.env.PORT || 3000`

## Advanced Route Handling

Here's an example of handling different routes with JSON responses:

```javascript
const server = http.createServer((req, res) => {
    try {
        // Set default headers
        res.setHeader('Content-Type', 'application/json');
        
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

            default:
                res.statusCode = 404;
                res.end(JSON.stringify({
                    error: 'Not Found',
                    message: 'The requested resource was not found'
                }));
        }
    } catch (error) {
        // Error handling
        console.error('Error handling request:', error);
        res.statusCode = 500;
        res.end(JSON.stringify({
            error: 'Internal Server Error',
            message: 'An unexpected error occurred'
        }));
    }
});
```

## Comprehensive Error Handling

The server implements multiple layers of error handling:

1. **Request-level Error Handling**
```javascript
try {
    // Server logic
} catch (error) {
    console.error('Error handling request:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred'
    }));
}
```

2. **Server-level Error Handling**
```javascript
server.on('error', (error) => {
    console.error('Server error:', error);
});
```

3. **Process-level Error Handling**
```javascript
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
});
```

## Graceful Shutdown

Implementing graceful shutdown ensures proper cleanup:

```javascript
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

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
```

## Security Best Practices

1. **Security Headers**
```javascript
res.setHeader('Content-Type', 'application/json');
res.setHeader('X-Content-Type-Options', 'nosniff');
res.setHeader('X-Frame-Options', 'DENY');
res.setHeader('X-XSS-Protection', '1; mode=block');
```

2. **Status Codes**
   - 200: Successful responses
   - 404: Not found
   - 500: Server errors

3. **Error Messages**
   - Structured JSON responses
   - Appropriate error messages
   - No sensitive information in errors

## Testing the Server

1. Start the server:
   ```bash
   node server.js
   ```

2. Access the endpoints:
   - Homepage: `http://localhost:3000/`
   - About page: `http://localhost:3000/about`
   - API Status: `http://localhost:3000/api/status`
   - Test 404: `http://localhost:3000/nonexistent`

3. Test error handling:
   - Send malformed requests
   - Test graceful shutdown (Ctrl+C)
   - Monitor error logs

## Next Steps

For more advanced server functionality, consider:
- Using Express.js framework
- Implementing middleware
- Adding database connectivity
- Setting up authentication
- Implementing RESTful APIs
- Adding request validation
- Implementing rate limiting
- Setting up logging middleware
- Adding API documentation
