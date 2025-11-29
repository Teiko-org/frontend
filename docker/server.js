const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 8080;

const upstreamEnv = process.env.API_UPSTREAMS || '';
const upstreams = upstreamEnv.split(',').map(s => s.trim()).filter(Boolean);
if (upstreams.length === 0) {
  console.error('[frontend] API_UPSTREAMS não definido. Ex.: API_UPSTREAMS=10.0.2.203:8080,10.0.3.46:8080');
  process.exit(1);
}

let rr = 0;
const pick = () => `http://${upstreams[(rr++) % upstreams.length]}`;

// Static files (Vite build)
const distDir = path.join(__dirname, 'dist');
app.use(express.static(distDir));

// Proxy /api com round-robin por requisição, logs e timeouts
app.use('/api', (req, res, next) => {
  const target = pick();
  console.log(`[proxy] ${req.method} ${req.url} -> ${target}`);
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    xfwd: true,
    logLevel: 'debug',
    timeout: 15000,
    proxyTimeout: 15000,
    pathRewrite: { '^/api': '' },
    onError: (err, _req, proxyRes) => {
      console.error('[proxy] erro ao chamar backend:', err.message);
      if (!proxyRes.headersSent) {
        proxyRes.writeHead(502, { 'Content-Type': 'application/json' });
      }
      proxyRes.end(JSON.stringify({ error: 'Bad gateway', message: err.message }));
    },
  })(req, res, next);
});

// SPA fallback
app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(distDir, 'index.html')));

app.listen(port, () => console.log(`[frontend] Servindo em http://0.0.0.0:${port} | UPSTREAMS: ${upstreams.join(', ')}`));