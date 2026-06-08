const os = require('os');

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: (() => {
    const origins = ['localhost', '127.0.0.1'];
    try {
      const interfaces = os.networkInterfaces();
      for (const name of Object.keys(interfaces)) {
        for (const net of interfaces[name] || []) {
          // Skip internal/loopback and non-IPv4 addresses
          if (net.family === 'IPv4' && !net.internal) {
            origins.push(net.address);
            origins.push(`${net.address}:3000`);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to detect local IP interfaces for allowedDevOrigins:', e);
    }
    return origins;
  })(),
};

module.exports = nextConfig;
