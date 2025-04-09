# LatencyJS

[![npm version](https://img.shields.io/npm/v/latencyjs.svg)](https://www.npmjs.com/package/latencyjs)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  
[![Downloads](https://img.shields.io/npm/dt/latencyjs.svg)](https://www.npmjs.com/package/latencyjs)  

A lightweight Express.js middleware for monitoring API request latency and logging slow requests.

## What is LatencyJS?

LatencyJS is a performance monitoring middleware for Express.js applications that helps you identify and track slow API requests. It works by:

1. **Measuring Response Times**: Automatically tracks how long each API endpoint takes to respond
2. **Configurable Thresholds**: Allows you to set different time thresholds for different HTTP methods
3. **Smart Logging**: Logs requests that exceed the configured thresholds with detailed information
4. **Flexible Configuration**: Supports various logging options including file-based and console output
5. **Visual Feedback**: Uses colored logs to distinguish between different severity levels

This middleware is particularly useful for:
- Identifying performance bottlenecks in your API
- Monitoring response times in production
- Setting up alerts for slow requests
- Debugging performance issues
- Maintaining API quality standards

## Features

- 🔍 **Track API Response Times**: Monitor how long your API endpoints take to respond
- ⚙️ **Customizable Thresholds**: Set different thresholds for different HTTP methods
- 📝 **Flexible Logging**: Configure log levels, file paths, and console output
- 🎨 **Colored Logs**: Visual distinction between different log levels
- 🔌 **Easy Integration**: Simple setup with Express.js applications

## Installation

```bash
npm install latencyjs
```

## Basic Usage

```javascript
const express = require('express');
const latency = require('latencyjs');

const app = express();

// Basic usage with default settings (100ms threshold)
app.use(latency());

// OR set a global threshold for all methods
app.use(latency({
  threshold: 50  // This will set 50ms as threshold for all HTTP methods
}));

// Your routes here
app.get('/api/data', (req, res) => {
  res.json({ data: 'some data' });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

> **Note**: To set a global threshold for all HTTP methods, always use the object configuration syntax with the `threshold` property. The middleware will use this value as the default threshold for any method not specified in `customThresholds`.

## Configuration Options

### Default Configuration

```javascript
app.use(latency({
  threshold: 100, // Default threshold in milliseconds (used for methods not specified in customThresholds)
  logging: {
    enabled: true,
    level: 'warn',
    logFile: 'slow-requests.log',
    consoleEnabled: true
  },
  customThresholds: {
    GET: 100,
    POST: 200,
    PUT: 150,
    DELETE: 100,
    PATCH: 150
  }
}));
```

### Method-Specific Thresholds

```javascript
app.use(latency({
  customThresholds: {
    GET: 50,    // GET requests slower than 50ms will be logged
    POST: 200,  // POST requests slower than 200ms will be logged
    PUT: 150    // PUT requests slower than 150ms will be logged
  }
}));
```

### Logging Configuration

```javascript
app.use(latency({
  logging: {
    enabled: true,        // Enable/disable logging
    consoleEnabled: false, // Disable console output
    level: 'info',        // Log level (info, warn, error)
    logFile: 'custom-slow-requests.log' // Custom log file path
  }
}));
```

### Disable Logging

```javascript
app.use(latency({
  logging: {
    enabled: false // Disable all logging
  }
}));
```

## Log Output

The middleware logs slow requests with the following information:
- Timestamp
- Log level (colored based on level)
- HTTP method
- Request URL
- Response time in milliseconds
- Threshold that was exceeded

Example log output:
```
[2023-04-08T12:34:56.789Z] [WARN] Slow Request found => GET:/api/data took: 150.25 milliseconds (threshold: 100ms)
```

## Log Levels

- **info**: Green colored logs for informational messages
- **warn**: Yellow colored logs for warning messages
- **error**: Red colored logs for error messages

## Support

If you find this package helpful, consider buying me a coffee! Your support helps me maintain and improve this project.

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/sagarchopda)

## License

MIT