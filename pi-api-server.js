// pi-api-server.js
const express = require('express');
const { exec } = require('child_process');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'pi-api' });
});

// Pi API endpoint
app.post('/api/pi', async (req, res) => {
  const { prompt, provider = 'openai', model = 'gpt-4', files = [] } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Build Pi command
  let command = `pi --provider ${provider} --model ${model} -p "${prompt.replace(/"/g, '\\"')}" --mode json`;

  // Add files if provided
  files.forEach(file => {
    command += ` @${file}`;
  });

  // Execute Pi
  exec(command, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        error: 'Pi execution failed',
        details: stderr || error.message
      });
    }

    try {
      const result = JSON.parse(stdout);
      res.json({
        success: true,
        data: result
      });
    } catch (parseError) {
      res.json({
        success: true,
        data: {
          response: stdout,
          raw: true
        }
      });
    }
  });
});

// Batch processing
app.post('/api/pi/batch', async (req, res) => {
  const { requests } = req.body;

  if (!Array.isArray(requests)) {
    return res.status(400).json({ error: 'Requests must be an array' });
  }

  const results = [];

  for (const request of requests) {
    const { prompt, provider = 'openai', model = 'gpt-4' } = request;

    const command = `pi --provider ${provider} --model ${model} -p "${prompt.replace(/"/g, '\\"')}" --mode json`;

    const result = await new Promise((resolve) => {
      exec(command, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
        if (error) {
          resolve({ error: stderr || error.message });
        } else {
          try {
            resolve(JSON.parse(stdout));
          } catch {
            resolve({ response: stdout, raw: true });
          }
        }
      });
    });

    results.push(result);
  }

  res.json({ success: true, results });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Pi API Server running on http://localhost:${PORT}`);
  console.log(`POST /api/pi - Single request`);
  console.log(`POST /api/pi/batch - Batch requests`);
  console.log(`GET /health - Health check`);
});
