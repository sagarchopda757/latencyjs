const express = require('express');
const request = require('supertest');
const latency = require('../index');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Increase timeout for tests that involve delays
jest.setTimeout(10000);

describe('Latency Middleware Tests', () => {
    let app;
    let logFile;
    let server;

    beforeEach(() => {
        app = express();
        // Use temp directory instead of test directory to avoid permission issues
        logFile = path.join(os.tmpdir(), `test-slow-requests-${Date.now()}.log`);
    });

    afterEach(async () => {
        // Clean up log file after each test
        try {
            if (fs.existsSync(logFile)) {
                fs.unlinkSync(logFile);
            }
        } catch (err) {
            console.warn('Could not delete log file:', err);
        }

        // Close server if it exists
        if (server && server.listening) {
            await new Promise((resolve) => server.close(resolve));
        }
    });

    it('should work with only threshold parameter', async () => {
        const middleware = latency({
            threshold: 150
        });

        app.use(middleware);
        app.get('/threshold-only', (req, res) => {
            setTimeout(() => res.send('Threshold only test'), 200); // This should be logged as it's above 150ms
        });

        server = app.listen(0);
        await request(server).get('/threshold-only');
        
        // Small delay to ensure logging completes
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check that the default log file exists
        const defaultLogFile = 'slow-requests.log';
        expect(fs.existsSync(defaultLogFile)).toBe(true);
        
        // Clean up the default log file
        if (fs.existsSync(defaultLogFile)) {
            fs.unlinkSync(defaultLogFile);
        }
    });

    it('should not log when request is faster than threshold', async () => {
        const middleware = latency({
            threshold: 1000, // High threshold to ensure request is fast
            logging: {
                level: 'info',
                logFile: logFile,
                consoleEnabled: false
            }
        });

        app.use(middleware);
        app.get('/fast', (req, res) => res.send('Fast response'));

        server = app.listen(0);
        await request(server).get('/fast');
        
        // Small delay to ensure logging would have occurred if it was going to
        await new Promise(resolve => setTimeout(resolve, 100));
        
        expect(fs.existsSync(logFile)).toBe(false);
    });

    it('should log when request is slower than threshold', async () => {
        const middleware = latency({
            threshold: 10, // Low threshold to ensure request is slow
            logging: {
                level: 'info',
                logFile: logFile,
                consoleEnabled: false
            }
        });

        app.use(middleware);
        app.get('/slow', (req, res) => {
            setTimeout(() => res.send('Slow response'), 30);
        });

        server = app.listen(0);
        await request(server).get('/slow');
        
        // Small delay to ensure logging completes
        await new Promise(resolve => setTimeout(resolve, 100));
        
        expect(fs.existsSync(logFile)).toBe(true);
        const logContent = fs.readFileSync(logFile, 'utf8');
        expect(logContent).toContain('Slow Request found');
        expect(logContent).toContain('/slow');
    });

    it('should use custom thresholds for different HTTP methods', async () => {
        const middleware = latency({
            threshold: 1000,
            logging: {
                level: 'info',
                logFile: logFile,
                consoleEnabled: false
            },
            customThresholds: {
                GET: 20,
                POST: 10
            }
        });

        app.use(middleware);
        app.get('/custom-get', (req, res) => {
            setTimeout(() => res.send('GET response'), 30);
        });

        app.post('/custom-post', (req, res) => {
            setTimeout(() => res.send('POST response'), 20);
        });

        server = app.listen(0);
        await request(server).get('/custom-get');
        await request(server).post('/custom-post');
        
        // Small delay to ensure logging completes
        await new Promise(resolve => setTimeout(resolve, 100));
        
        expect(fs.existsSync(logFile)).toBe(true);
        const logContent = fs.readFileSync(logFile, 'utf8');
        expect(logContent).toContain('GET');
        expect(logContent).toContain('POST');
    });

    it('should respect logging level settings', async () => {
        const middleware = latency({
            threshold: 10,
            logging: {
                level: 'error',
                logFile: logFile,
                consoleEnabled: false
            }
        });

        app.use(middleware);
        app.get('/level-test', (req, res) => {
            setTimeout(() => res.send('Level test response'), 30);
        });

        server = app.listen(0);
        await request(server).get('/level-test');
        
        // Small delay to ensure logging completes
        await new Promise(resolve => setTimeout(resolve, 100));
        
        expect(fs.existsSync(logFile)).toBe(true);
        const logContent = fs.readFileSync(logFile, 'utf8');
        expect(logContent).toContain('ERROR');
    });

    it('should handle disabled logging', async () => {
        const middleware = latency({
            threshold: 10,
            logging: {
                enabled: false,
                level: 'info',
                logFile: logFile,
                consoleEnabled: false
            }
        });

        app.use(middleware);
        app.get('/disabled', (req, res) => {
            setTimeout(() => res.send('Disabled logging test'), 30);
        });

        server = app.listen(0);
        await request(server).get('/disabled');
        
        // Small delay to ensure logging would have occurred if it was going to
        await new Promise(resolve => setTimeout(resolve, 100));
        
        expect(fs.existsSync(logFile)).toBe(false);
    });

    it('should log when request is slower than threshold for just threshold passed', async () => {
        const middleware = latency({
            threshold: 50 // Low threshold to ensure request is slow
        });

        app.use(middleware);
        app.get('/slow', (req, res) => {
            setTimeout(() => res.send('Slow response'), 70);
        });

        server = app.listen(0);
        await request(server).get('/slow');
        
        // Small delay to ensure logging completes
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check that the default log file exists and contains the expected content
        expect(fs.existsSync(defaultLogFile)).toBe(true);
        const logContent = fs.readFileSync(defaultLogFile, 'utf8');
        expect(logContent).toContain('Slow Request found');
        expect(logContent).toContain('/slow');
    });
}); 