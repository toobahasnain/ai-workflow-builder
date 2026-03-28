const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.post('/api/automate', async (req, res) => {
  const { workflow } = req.body;

  if (!workflow) {
    return res.status(400).json({ error: 'Please provide a workflow description' });
  }

  try {
    const prompt = `You are a business automation expert. 
A user described this workflow: "${workflow}"

Respond in EXACTLY this format with no extra text:
1. [Trigger step - how the workflow starts]
2. [Second step of the automation]
3. [Third step of the automation]
4. [Fourth step of the automation]
5. [Fifth step of the automation]
6. [Final output or result]

Each line must start with a number and period. Keep each step under 15 words. No bold, no headers, just the 6 numbered lines.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini error:', data);
      return res.status(500).json({ error: data.error?.message || 'Gemini API error' });
    }

    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
    res.json({ result });

  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'AI Workflow Builder API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});