# 🚀 LatencyJS - Track API Performance & Identify Slow Requests  

[![npm version](https://img.shields.io/npm/v/latencyjs.svg)](https://www.npmjs.com/package/latencyjs)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  
[![Downloads](https://img.shields.io/npm/dt/latencyjs.svg)](https://www.npmjs.com/package/latencyjs)  

## ⚡ Introduction  
`latencyjs` is a lightweight **middleware for Express.js** that tracks API response times and logs **slow requests** using [Winston](https://github.com/winstonjs/winston). It helps in identifying performance bottlenecks in your application.  

## 🎯 Features  
✅ **Track API Response Times**  
✅ **Customizable Threshold (in milliseconds)**  
✅ **Logs Slow Requests with Warning Highlight**  
✅ **Lightweight & Easy to Use**  
✅ **Works Seamlessly with Express.js**  

## 📦 Installation  

```bash
npm install latencyjs
```

🚀 Usage
Basic Setup
Add latencyjs middleware to your Express app:

```javascript  

const express = require("express");
const latency = require("latencyjs");

const app = express();
const PORT = 3000;

// Use latencyjs middleware with a threshold of 200ms
app.use(latency(500));

app.get("/", (req, res) => {
  setTimeout(() => res.send("Hello, World!"), 550); // Simulating a slow response
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

```

Custom Threshold
You can customize the threshold (default: 100ms):

```javascript  
app.use(latency(500)); // Logs requests taking longer than 500ms
```
📝 Example Log Output

```bash
 Slow Request found => GET:/ took: 550.08 milliseconds
```

🔥 Why Use LatencyJS?
Performance Monitoring: Quickly identify slow endpoints
Customizable Logging: Easily adjust the threshold
Zero Configuration Required: Just plug and play
🌟 Contributing
We welcome contributions! Feel free to submit issues or PRs.

### Buy Me a Coffee
Your support means a lot! If you'd like to show your appreciation, you can [buy me a coffee ☕][buymeacoffee.com/sagarchopda] by visiting the link below

[![Buy Me A Coffee][coffee-image]][coffee-url]


Every contribution helps keep the project alive and encourages further improvements.

[coffee-image]: https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png
[coffee-url]: https://buymeacoffee.com/sagarchopda

📜 License
This project is MIT Licensed.