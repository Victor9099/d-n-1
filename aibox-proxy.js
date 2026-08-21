const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

// Proxy to ai-box.vn
app.post('/v1/chat/completions', async (req, res) => {
  try {
    const response = await fetch('https://api.ai-box.vn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AIBOX_API_KEY}`
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
