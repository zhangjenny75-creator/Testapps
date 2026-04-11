/**
 * GEO Tool — Express server.
 *
 * Serves the static UI and exposes JSON endpoints for content analysis,
 * optimized rewrites, and JSON-LD schema generation.
 */

const express = require('express');
const path = require('path');
const {
  analyzeContent,
  generateOptimizedVersion,
  generateSchema,
} = require('./geo-analyzer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Analyze content for GEO score
app.post('/api/analyze', (req, res) => {
  const { text, platform = 'general' } = req.body || {};
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Provide a "text" string in the request body.' });
  }
  try {
    const analysis = analyzeContent(text, platform);
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generate an optimized rewrite template
app.post('/api/optimize', (req, res) => {
  const { text, platform = 'general' } = req.body || {};
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Provide a "text" string in the request body.' });
  }
  try {
    const optimized = generateOptimizedVersion(text, platform);
    res.json({ optimized });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generate JSON-LD schema markup
app.post('/api/schema', (req, res) => {
  const { text, options = {} } = req.body || {};
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Provide a "text" string in the request body.' });
  }
  try {
    const schema = generateSchema(text, options);
    res.json({ schema });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`GEO Tool running at http://localhost:${PORT}`);
});
